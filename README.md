# BrowserFileDownloadTester

<!-- <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/Vx4mJkaNNu) -->

## Installation

- Requires node 22
- To save time, I recommend globally aliasing the `nx` command to `npx nx` or global installed `npm i -g nx`.

## Features

1. Determine if a browser download of an asset works on your platform. Meant for native mobile, desktop, server download testing.
2. Determine if a browser asset can render if given base64 or a blob file.

### Covers the following cases

- Assets can be downloaded via previews
- Base64 assets
- Blob assets (from local browser that need to be downloaded on the client)
- anchor tags with download attribute and a url asset

### UI

The WebUI allows the user to click a specific file type. Currently only `.png` and `.webp` have actual assets that will load actual data.

Other file types can be generated via the command `npm run generate-assets` which will add more assets, all at 1 MegaByte in size.

This can be configured if you want within the [make-files.sh](scripts/make-files.sh) script example if you want to test downloading a 500MB files. You could swap the file size to `FILE_SIZE="500mb"` which would make files take a long time to download and likely would not work well with base64 from the server since it sends the entire string.

#### Example UI

The second image shows a preview of the downloaded file. This could be any file you place within assets if you need to test a specific file.

<div>
  <img alt="Tester UI with no preview" src="./docs/images/browser-link-tester-preview.png" height="300" style="max-height:300px;max-width:20%;" />
  <img alt="Tester UI with preview" src="./docs/images/browser-link-tester-with-image-resolved.png" height="300" style="max-height:300px;max-width:20%;" />
  <img alt="Tester UI with preview" src="./docs/images/browser-link-tester-large.png" height="300" style="max-height:300px;max-width:40%;" />
</div>

## Quick Start

Quick start to launch all projects both web and server.

```sh
npm install
npm run generate-assets
nx run-many -t serve
```

- Web: <http://localhost:4200>
- Server <http://localhost:3333>

For android make sure to rebind ports.

```sh
adb reverse tcp:4200 tcp:4200
adb reverse tcp:3333 tcp:3333
```

Extensive rebind script for android (for multi-device runs too) see [modular-platform-config](https://github.com/FrederickEngelhardt/modular-platform-config/blob/main/src/zsh/plugins/android/android-adb.zsh)

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build file-api
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:

```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Genenerate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Attributions

- roadsign image by <a href="https://pixabay.com/users/geralt-9301/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=361514">Gerd Altmann</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=361514">Pixabay</a>
