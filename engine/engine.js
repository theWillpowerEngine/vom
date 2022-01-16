const Color = require('color')
const { ipcRenderer } = require("electron")
const makePlayer = require("@eng/player")
const makeZelazny = require("zelazny")
const fs = require('fs')

module.exports = () => {

    let getZelaznyConfigObject = (eng) => {
        return {
            macros: {
                load(pop, expect) {
                    try {
                        var content = fs.readFileSync(`zelazny\\nodes\\${pop()}.z`, 'utf8')
                        eng.zelazny.parse(content, true)
                    } catch (ex) {
                        console.error(`Bad attempt to load zelazny: ` + ex)
                    }
                }
            },
            
            specialLinks: {
                '$' : `<a class='action-link default-link' data-action='[v __id]'>[v __text]</a><span class='action-span' data-id='[v __id]'>[v __action]</span>`,
                '*' : `<li class='action-link-li'><a class='action-link' data-action='[v __id]'>[v __text]</a><span class='action-span' data-id='[v __id]'>[v __action]</span></li>`
            }
        }
    }

    let engine = {
        zelazny: null,
        player: null,

        async getZelazny(group, node) {
            if(node)
                return await ipcRenderer.invoke("zelazny", group + "\\" + node)
            else
                return await ipcRenderer.invoke("zelazny", group)
        },

        async init() {
            engine.zelazny = makeZelazny(engine, {}, getZelaznyConfigObject(engine))
            engine.player = makePlayer(engine)
        }
    }

    return engine
}