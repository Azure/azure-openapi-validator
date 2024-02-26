/* eslint-disable no-console */
import { execSync } from "child_process";
import { lstat, readdir, readFile, writeFile } from "fs/promises";
import {existsSync} from "fs"
import { join } from "path";
async function getAllChanges(workspaceRoot) {
    const changeDir = join(workspaceRoot, "common", "changes");
    const files = await findAllFiles(changeDir);
    return await Promise.all(files.map((x) => readJsonFile(x)));
}
/**
 * @returns map of package to number of changes.
 */
async function getChangeCountPerPackage(workspaceRoot) {
    const changes = await getAllChanges(workspaceRoot);
    console.log("Changes", changes);
    const changeCounts = {};
    for (const change of changes) {
        if (!(change.packageName in changeCounts)) {
            changeCounts[change.packageName] = 0;
        }
        // Count all changes that are not "none"
        changeCounts[change.packageName] += change.changes.filter((x) => x.type !== "none").length;
    }
    return changeCounts;
}
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
async function appendPrereleaseSemverSuffix(changeCounts, packages) {
    var _a;
    const updatedManifests = {};
    const timestamp = getIsoLikeTimestamp();
    for (const [packageName, packageInfo] of Object.entries(packages)) {
        const changeCount = (_a = changeCounts[packageName]) !== null && _a !== void 0 ? _a : 0;
        const packageJsonPath = join(packageInfo.path, "package.json");
        const packageJsonContent = await readJsonFile(packageJsonPath);
        const newVersion = changeCount === 0
            // As of [1] we no longer require running `rush change`.
            // As a side-effect of this, the `changeCount` here is zero.
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
            ? `${packageInfo.version}-beta.${timestamp}`
            // As of 2/26/2024 previously this line was 
            //
            //  `${packageJsonContent.version}.${changeCount}`;
            //
            // but now it is:
            // 
            //   `${packageInfo.version}.${changeCount}`;
            //
            // Effectively this means that if the code has package version of,
            // say, "1.0.4", this logic will now release "1.0.4-beta.1" 
            // instead of "1.0.5-beta.1".
            // 
            // The reason for this change is as follows:
            // The ${packageJsonContent.version} is incremented by one a call to
            // `npx @microsoft/rush publish --apply --partial-prerelease --prerelease-name=...` 
            // done upstream. But we no longer want this.
            // This is because previously we operated under the model that all the package.json versions are managed indirectly by running
            // appropriate rush commands like `rush change` or `rush version --bump` or `rush publish`.
            // Now we no longer do this. Now the developer is responsible for updating the package.json version
            // in their PR manually.
            //
            // All of this is a hacky temporary solution until we cleanup this entire pre-release process. See [1].
            //
            // [1] https://github.com/Azure/azure-sdk-tools/issues/7619
            : `${packageInfo.version}.${changeCount}`;
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
    let changeCounts = {};
    let packages = {};
    const prerelease_type = process.env.PRERELEASE_TYPE || 'beta'
    for (const workspaceRoot of workspaceRoots) {
        changeCounts = { ...changeCounts, ...(await getChangeCountPerPackage(workspaceRoot)) };
        packages = { ...packages, ...(await getPackages(workspaceRoot)) };
    }
    console.log("Change counts: ", changeCounts);
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
    console.log(`Adding prerelease numbers to packages. changeCounts: ${changeCounts.length}`);
    await appendPrereleaseSemverSuffix(changeCounts, packages);
    updateOpenapiValidatorPck()
}
async function findAllFiles(dir) {
    const files = [];
    if (!existsSync(dir)) {
        return files
    }
    for (const file of await readdir(dir)) {
        const path = join(dir, file);
        const stat = await lstat(path);
        if (stat.isDirectory()) {
            files.push(...(await findAllFiles(path)));
        }
        else {
            files.push(path);
        }
    }
    return files;
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
