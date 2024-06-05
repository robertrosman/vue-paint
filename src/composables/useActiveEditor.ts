import type { useEditor } from './useEditor'

type Editor = ReturnType<typeof useEditor>
let activeEditor: Editor

export function useActiveEditor() {

  function setActiveEditor(editor: Editor) {
    activeEditor = editor
  }

  function getActiveEditor() {
    return activeEditor
  }

  return {
    setActiveEditor,
    getActiveEditor
  }
}