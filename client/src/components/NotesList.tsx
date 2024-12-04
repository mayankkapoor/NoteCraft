import { type Note } from "@db/schema";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface NotesListProps {
  notes: Note[] | undefined;
  isLoading: boolean;
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}

export function NotesList({ notes, isLoading, selectedNote, onSelectNote }: NotesListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 space-y-4">
        {notes?.map((note) => (
          <Card
            key={note.id}
            className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
              selectedNote?.id === note.id ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectNote(note)}
          >
            <h3 className="font-medium mb-2">{note.title}</h3>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(note.updatedAt), 'MMM dd, yyyy HH:mm')}
              </p>
              <p className="text-xs text-muted-foreground/75">
                Created: {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            {Array.isArray(note.tags) && note.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {note.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
