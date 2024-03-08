/* eslint-disable no-console */
import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

async function getPackages(workspaceRoot) {
    const rushJson = await readJsonFile(join(workspaceRoot, "rush.json"));
    const paths = {};
    for (const project of rushJson.projects) {
        const packagePath = join(workspaceRoot, project.projectFolder);
        const pkg = await readJsonFile(join(packagePath, "package.json"));
        paths[project.packageName] = {
            path: packagePath,
            version: pkg.version,
        };
    }
    return paths;
}
/**
 * Update the package dependencies to match the newly updated version.
 * @param {*} packageManifest
 * @param {*} updatedPackages
 */
function updateDependencyVersions(packageManifest, updatedPackages) {
    const clone = {
        ...packageManifest,
    };
    for (const depType of ["dependencies", "devDependencies", "peerDependencies"]) {
        const dependencies = {};
        const currentDeps = packageManifest[depType];
        if (currentDeps) {
            for (const [name, currentVersion] of Object.entries(currentDeps)) {
                const updatedPackage = updatedPackages[name];
                if (updatedPackage) {
                    dependencies[name] = `~${updatedPackage.newVersion}`;
                }
                else {
                    dependencies[name] = currentVersion;
                }
            }
        }
        clone[depType] = dependencies;
    }
    return clone;
}
async function appendPrereleaseSemverSuffix(packages) {
    var _a;
    const updatedManifests = {};
    const timestamp = getIsoLikeTimestamp();
    for (const [packageName, packageInfo] of Object.entries(packages)) {
        const packageJsonPath = join(packageInfo.path, "package.json");
        const packageJsonContent = await readJsonFile(packageJsonPath);
        // As of [1] we no longer require running `rush change`.
        // As a side-effect of this, there is no concept of `changeCount` anymore.
        // To work around the fact we don't know the change count, we append a timestamp to the version.
        // This is temporary solution until the work item [2] is completed.
        // Note that if we would not append anything to packageInfo.version, we would end up
        // inadvertently pushing prerelease bits to production packages as soon as LintDiff PR is merged.
        // Details on that in [2].
        //
        // The "-beta." infix is here to simulate the behavior of `rush publish --apply --partial-prerelease --prerelease-name="beta"`
        // called upstream in this script. It does no-op when changeCount is zero, hence we mimic that behavior here.
        //
        // [1] https://github.com/Azure/azure-openapi-validator/pull/659
        // [2] https://github.com/Azure/azure-sdk-tools/issues/7619        
        const newVersion = `${packageInfo.version}-beta.${timestamp}`
        console.log(`Setting version for ${packageName} to '${newVersion}'`);
        updatedManifests[packageName] = {
            packageJsonPath,
            oldVersion: packageJsonContent.version,
            newVersion: newVersion,
            manifest: {
                ...packageJsonContent,
                version: newVersion,
            },
        };
    }
    for (const { packageJsonPath, manifest } of Object.values(updatedManifests)) {
        const newManifest = updateDependencyVersions(manifest, updatedManifests);
        await writeFile(packageJsonPath, JSON.stringify(newManifest, null, 2));
    }
}

/**
 * @returns Date in format "YYYY-MM-DD-hh-mm-ss"
 */
function getIsoLikeTimestamp() {
    const date = new Date();

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because getMonth() returns 0-11
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    return formattedDate;
}

export async function bumpVersionsForPrerelease(workspaceRoots) {
    let packages = {};
    const prerelease_type = process.env.PRERELEASE_TYPE || 'beta'
    for (const workspaceRoot of workspaceRoots) {
        packages = { ...packages, ...(await getPackages(workspaceRoot)) };
    }
    console.log("Packages", packages);
    // Bumping with rush publish so rush computes from the changes what will be the next non prerelease version.
    console.log("Bumping versions with rush publish");
    for (const workspaceRoot of workspaceRoots) {
        // https://rushjs.io/pages/commands/rush_publish/
        const stdout = execSync(`npx @microsoft/rush publish --apply --partial-prerelease --prerelease-name="${prerelease_type}"`, {
            cwd: workspaceRoot,
        });
        console.log(`npx @microsoft/rush publish --apply --partial-prerelease --prerelease-name="${prerelease_type} ` +
            `cwd: "${workspaceRoot}" stdout: "${stdout.toString()}"`)
    }
    await appendPrereleaseSemverSuffix(packages);
    updateOpenapiValidatorPck()
}
// update rulesets and core version in the package.json of openapi-validator to the latest beta version.
async function updateOpenapiValidatorPck() {
    const packagePath = `packages/azure-openapi-validator/autorest/package.json`
    const pkg = await readJsonFile(packagePath)
    pkg.dependencies["@microsoft.azure/openapi-validator-core"] = "beta"
    pkg.dependencies["@microsoft.azure/openapi-validator-rulesets"] = "beta"
    await writeFile(packagePath,JSON.stringify(pkg,null,2))
}

async function readJsonFile(filename) {
    const content = await readFile(filename);
    return JSON.parse(content.toString());
}

bumpVersionsForPrerelease(["."])
