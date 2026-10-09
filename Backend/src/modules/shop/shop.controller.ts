import { Request, Response, NextFunction } from 'express';
import { ShopService } from './shop.service';
import { sendEmail } from '../../config/brevo';

export const ShopController = {
  async addStaff(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const shopId = req.user.shopId;
      if (!shopId) return res.status(403).json({ message: 'User does not belong to a shop' });

      const { email, role, name, password } = req.body;
      const { user, rawPassword } = await ShopService.addStaffMember({ shopId, email, role, name, password });

      // Send email to staff member with their credentials
      await sendEmail(
        email, 
        'Welcome to BayFlow Staff Portal', 
        `You have been added as ${role}. Your login password is: ${rawPassword}`
      ).catch(console.error);

      res.status(201).json({ success: true, user, message: 'Staff member added successfully.' });
    } catch (error) {
      next(error);
    }
  }
};
