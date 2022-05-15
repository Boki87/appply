import React, {useRef} from 'react'
import {Editor} from '@tinymce/tinymce-react'

const NotesEditor = ({val}: {val: string}) => {
    const editorRef = useRef(null)

    return (
        <>
            <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={val}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons'
                    ],
                    toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | link anchor codesample',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    )
}

export default NotesEditor