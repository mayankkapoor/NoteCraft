import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { notes } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get all notes for the authenticated user
  app.get("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const userNotes = await db.select().from(notes).where(eq(notes.userId, req.user!.id));
      res.json(userNotes);
    } catch (error) {
      res.status(500).send("Failed to fetch notes");
    }
  });

  // Create a new note
  app.post("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [newNote] = await db.insert(notes).values({
        ...req.body,
        userId: req.user!.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      res.json(newNote);
    } catch (error) {
      res.status(500).send("Failed to create note");
    }
  });

  // Update a note
  app.put("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Ensure we have a valid note ID
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).send("Invalid note ID");
      }

      // Get the existing note to ensure it exists and belongs to the user
      const [existingNote] = await db.select()
        .from(notes)
        .where(eq(notes.id, noteId))
        .limit(1);

      if (!existingNote) {
        return res.status(404).send("Note not found");
      }

      if (existingNote.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to update this note");
      }

      // Update the note with the new data
      const [updatedNote] = await db.update(notes)
        .set({
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags,
          updatedAt: new Date()
        })
        .where(eq(notes.id, noteId))
        .returning();

      res.json(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).send("Failed to update note");
    }
  });

  // Delete a note
  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).send("Invalid note ID");
      }

      // Check if note exists and belongs to user
      const [existingNote] = await db.select()
        .from(notes)
        .where(eq(notes.id, noteId))
        .limit(1);

      if (!existingNote) {
        return res.status(404).send("Note not found");
      }

      if (existingNote.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to delete this note");
      }

      await db.delete(notes).where(eq(notes.id, noteId));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).send("Failed to delete note");
    }
  });
}
