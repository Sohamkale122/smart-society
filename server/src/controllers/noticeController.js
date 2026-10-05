import { dbStore } from '../data/dbStore.js';

export const getNotices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let notices = await dbStore.getNotices();

    if (category) {
      notices = notices.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      notices = notices.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.authorName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, targetAudience, pinned, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Notice title and content are required.' });
    }

    const newNotice = await dbStore.createNotice({
      title,
      content,
      category: category || 'General',
      priority: priority || 'normal',
      targetAudience: targetAudience || 'All Residents',
      pinned: Boolean(pinned),
      authorName: req.user.name,
      authorRole: req.user.designation || (req.user.role === 'admin' ? 'Society Secretary' : 'Managing Committee'),
      attachments: req.body.attachments || [],
      expiresAt: expiresAt || null
    });

    res.status(201).json({
      success: true,
      message: 'Notice published to society bulletin board!',
      notice: newNotice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acknowledgeNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const residentInfo = {
      userId: req.user.id || req.user._id,
      name: req.user.name,
      flatNumber: req.user.flatNumber
    };

    const updated = await dbStore.acknowledgeNotice(id, residentInfo);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({
      success: true,
      message: 'Notice acknowledged successfully',
      notice: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
