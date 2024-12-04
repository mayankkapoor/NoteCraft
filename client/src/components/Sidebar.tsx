import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, LogOut } from "lucide-react";
import { useUser } from "../hooks/use-user";
import { useNotes } from "../hooks/use-notes";

export function Sidebar() {
  const { user, logout } = useUser();
  const { createNote } = useNotes();

  const handleCreateNote = () => {
    createNote.mutate({
      title: "Untitled Note",
      content: "",
      userId: user!.id,
      tags: [] as string[]
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen flex flex-col border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Notes</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Button
            onClick={handleCreateNote}
            className="w-full justify-start"
            disabled={createNote.isPending}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
