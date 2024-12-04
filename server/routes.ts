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
      const [updatedNote] = await db.update(notes)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(notes.id, parseInt(req.params.id)))
        .returning();
      res.json(updatedNote);
    } catch (error) {
      res.status(500).send("Failed to update note");
    }
  });

  // Delete a note
  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      await db.delete(notes).where(eq(notes.id, parseInt(req.params.id)));
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Failed to delete note");
    }
  });
}
