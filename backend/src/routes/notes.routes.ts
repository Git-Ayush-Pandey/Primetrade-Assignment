import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note';
import { AuthRequest, authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Require authentication for all note routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Get notes (Admins get all, Users get their own)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    let notes;

    if (role === 'admin') {
      notes = await Note.find().populate('authorId', 'email');
    } else {
      notes = await Note.find({ authorId: userId });
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
});

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.post('/', [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('content').notEmpty().withMessage('Content is required').trim()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const { title, content } = req.body;
    const { userId } = req.user!;

    const note = new Note({ title, content, authorId: userId });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 */
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('content').optional().notEmpty().withMessage('Content cannot be empty').trim()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const { userId, role } = req.user!;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Only author or admin can update
    if (note.authorId.toString() !== userId && role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this note' });
      return;
    }

    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted
 */
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Only author or admin can delete
    if (note.authorId.toString() !== userId && role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this note' });
      return;
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
});

export default router;
