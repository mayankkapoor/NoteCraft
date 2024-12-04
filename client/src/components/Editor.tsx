import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Save } from 'lucide-react';
import { useNotes } from '../hooks/use-notes';
import { type Note } from '@db/schema';
import { useEffect, useState } from 'react';

interface EditorProps {
  note: Note | null;
}

export function Editor({ note }: EditorProps) {
  const { updateNote } = useNotes();
  const [localTitle, setLocalTitle] = useState(note?.title || '');
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content ? JSON.parse(JSON.stringify(note.content)) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] px-8 py-6'
      }
    },
    onUpdate: ({ editor }) => {
      if (note && !updateNote.isPending) {
        const content = editor.getJSON();
        updateNote.mutate({
          ...note,
          content,
          title: note.title
        });
      }
    }
  });

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(JSON.parse(JSON.stringify(note.content)));
      setLocalTitle(note.title);
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
      <div className="border-b p-4 flex items-center gap-2">
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className="flex-1 text-2xl font-semibold bg-transparent border-none focus:outline-none"
          placeholder="Untitled Note"
        />
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => {
            if (note && !updateNote.isPending) {
              updateNote.mutate({
                ...note,
                title: localTitle,
                content: editor?.getJSON() || note.content
              });
            }
          }}
          disabled={updateNote.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
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