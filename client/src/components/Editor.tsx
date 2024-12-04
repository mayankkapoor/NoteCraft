import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { useNotes } from '../hooks/use-notes';
import { type Note } from '@db/schema';
import { useEffect } from 'react';

interface EditorProps {
  note: Note | null;
}

export function Editor({ note }: EditorProps) {
  const { updateNote } = useNotes();
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content ? JSON.parse(JSON.stringify(note.content)) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] px-8 py-6'
      }
    },
    onUpdate: ({ editor }) => {
      if (note) {
        updateNote.mutate({
          ...note,
          content: editor.getJSON()
        });
      }
    }
  });

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(JSON.parse(JSON.stringify(note.content)));
    }
  }, [note, editor]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select or create a note to start editing
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#fafaf9]">
      <div className="border-b p-4">
        <input
          type="text"
          value={note.title}
          onChange={(e) => {
            if (note) {
              updateNote.mutate({
                ...note,
                title: e.target.value
              });
            }
          }}
          className="w-full text-2xl font-semibold bg-transparent border-none focus:outline-none mb-2"
          placeholder="Untitled Note"
        />
      </div>
      <div className="border-b p-2 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-secondary' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-secondary' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-secondary' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-secondary' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
}
