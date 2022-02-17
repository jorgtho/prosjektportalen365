import initSpfxJsom, { ExecuteJsomQuery } from 'spfx-jsom'

/**
 * Change phase
 *
 * @param {string} phaseName
 * @param {string} absoluteUrl absoluteurl
 */
export const changeWelcomePage = async (
  phaseName: string,
  absoluteUrl: string
) => {
  try {
    const spfxJsomContext = await initSpfxJsom(absoluteUrl)
    spfxJsomContext.jsomContext.web['get_rootFolder']()['set_welcomePage'](`SitePages/${phaseName}.aspx`)
    spfxJsomContext.jsomContext.web.update()
    await ExecuteJsomQuery(spfxJsomContext.jsomContext)
  } catch (error) {
    throw error
  }
}
