/* eslint-disable no-console */
import { execSync } from "child_process";
import { lstat, readdir, readFile, writeFile } from "fs/promises";
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
            // Count all changes that are not "none"
            changeCounts[change.packageName] = 0;
        }
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
async function addPrereleaseNumber(changeCounts, packages) {
    var _a;
    const updatedManifests = {};
    for (const [packageName, packageInfo] of Object.entries(packages)) {
        const changeCount = (_a = changeCounts[packageName]) !== null && _a !== void 0 ? _a : 0;
        const packageJsonPath = join(packageInfo.path, "package.json");
        const packageJsonContent = await readJsonFile(packageJsonPath);
        const newVersion = changeCount === 0
            ? packageInfo.version // Use existing version. Bug in rush --partial-prerelease not working
            : `${packageJsonContent.version}.${changeCount}`;
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
        execSync(`npx @microsoft/rush publish --apply --partial-prerelease --prerelease-name="${prerelease_type}"`, {
            cwd: workspaceRoot,
        });
    }
    console.log("Adding prerelease number");
    await addPrereleaseNumber(changeCounts, packages);
}
async function findAllFiles(dir) {
    const files = [];
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
async function readJsonFile(filename) {
    const content = await readFile(filename);
    return JSON.parse(content.toString());
}

bumpVersionsForPrerelease(["."])