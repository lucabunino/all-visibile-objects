import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u7r06rsg',
    dataset: 'production'
  },
  studioHost: 'allvisibleobjects',
  deployment: {
    appId: 'pzcnxjx605y930vtdwrvzi7i',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
