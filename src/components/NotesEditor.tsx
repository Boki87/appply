import {Button, HStack} from '@chakra-ui/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import {FaBold, FaItalic, FaStrikethrough, FaCode, FaRulerHorizontal} from 'react-icons/fa'
import {BsBlockquoteLeft} from 'react-icons/bs'
import {AiOutlineUnorderedList, AiOutlineOrderedList} from 'react-icons/ai'

const EditorMenuBar = ({editor}: {editor: any}) => {

  if(!editor) return null

  return (
    <HStack mb="10px">
      <Button size="sm" type="button" variant={editor.isActive('bold') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleBold().run()}><FaBold /></Button>
      <Button size="sm" type="button" variant={editor.isActive('italic') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></Button>
      <Button size="sm" type="button" variant={editor.isActive('strike') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleStrike().run()}><FaStrikethrough /></Button>
      <Button size="sm" type="button" variant={editor.isActive('code') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><FaCode /></Button>
      <Button size="sm" type="button" variant={editor.isActive('blockquote') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleBlockquote().run()}><BsBlockquoteLeft /></Button>
      <Button size="sm" type="button" variant={editor.isActive('horizontalrule') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().setHorizontalRule().run()}><FaRulerHorizontal /></Button>
      <Button size="sm" type="button" variant={editor.isActive('bulletlist') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleBulletList().run()}><AiOutlineUnorderedList /></Button>
      <Button size="sm" type="button" variant={editor.isActive('orderedlist') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleOrderedList().run()}><AiOutlineOrderedList /></Button>
      <Button size="sm" type="button" ariant={editor.isActive('paragraph') ? 'solid' : 'outline'} onClick={() => editor.chain().focus().setParagraph().run()}>p</Button>
      <Button size="sm" type="button" variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>h1</Button>
      <Button size="sm" type="button" variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>h2</Button>
      <Button size="sm" type="button" variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'outline'} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>h3</Button>
    </HStack>
  )
}




const NotesEditor = ({updateHandler, val}: {updateHandler: any, val: string}) => {
 

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: val,
    onUpdate({editor}) {
      // console.log(editor.getHTML())
      updateHandler(editor.getHTML())
    }

  })

  

  return (
    <>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}

export default NotesEditor
