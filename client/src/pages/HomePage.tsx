import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Editor } from "../components/Editor";
import { NotesList } from "../components/NotesList";
import { useNotes } from "../hooks/use-notes";
import { type Note } from "@db/schema";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function HomePage() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { notes, isLoading } = useNotes();

  return (
    <div className="h-screen flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <NotesList 
            notes={notes} 
            isLoading={isLoading}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <Editor note={selectedNote} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
