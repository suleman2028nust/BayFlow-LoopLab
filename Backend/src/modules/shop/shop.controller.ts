import { Request, Response, NextFunction } from 'express';
import { ShopService } from './shop.service';
import { sendEmail } from '../../config/brevo';

export const ShopController = {
  // 1. Create shop (Owner)
  async createShop(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { name, address, city, phone, phoneNumber, timezone, workingHours } = req.body;
      const shopPhone = phone || phoneNumber;
      const shop = await ShopService.createShop(user.userId, { name, address, city, phone: shopPhone, timezone, workingHours });
      res.status(201).json({ success: true, data: shop, shop, message: 'Shop created successfully' });
    } catch (error) {
      next(error);
    }
  },

  // 2. Public list of all shops
  async listAllShops(req: Request, res: Response, next: NextFunction) {
    try {
      const shops = await ShopService.listAllShops();
      res.status(200).json({ success: true, data: shops, shops });
    } catch (error) {
      next(error);
    }
  },

  // 3. Get shop details
  async getShopById(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const shop = await ShopService.getShopById(shopId as string);
      res.status(200).json({ success: true, data: shop, shop });
    } catch (error) {
      next(error);
    }
  },

  // 4. Update shop details (Owner)
  async updateShop(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const user = (req as any).user;
      const updated = await ShopService.updateShop(shopId as string, user, req.body);
      res.status(200).json({ success: true, data: updated, message: 'Shop updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  // 5. Add staff member (Owner)
  async addStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user.shopId;
      if (!shopId) return res.status(403).json({ message: 'User does not belong to a shop' });

      const { email, role, name, password, phoneNumber } = req.body;
      const { user, rawPassword } = await ShopService.addStaffMember({ shopId, email, role, name, password, phoneNumber });

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
  },

  // 6. List team members
  async getTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const team = await ShopService.getShopTeam(shopId as string);
      res.status(200).json({ success: true, data: team, team });
    } catch (error) {
      next(error);
    }
  },

  // 7. Remove staff member (Owner)
  async removeStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const userId = req.params.userId;
      const user = (req as any).user;
      await ShopService.removeStaffMember(shopId as string, userId as string, user);
      res.status(200).json({ success: true, message: 'Staff member removed from shop' });
    } catch (error) {
      next(error);
    }
  },

  // 8. Available slots for date
  async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ success: false, message: 'Query parameter "date" (YYYY-MM-DD) is required' });
      }
      const slots = await ShopService.getAvailableSlots(shopId as string, String(date));
      res.status(200).json({ success: true, data: slots, slots });
    } catch (error) {
      next(error);
    }
  },

  // 9. Service catalog handlers
  async listServices(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const services = await ShopService.listServices(shopId as string);
      res.status(200).json({ success: true, data: services, services });
    } catch (error) {
      next(error);
    }
  },

  async addService(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const { name, description, durationMinutes, basePrice } = req.body;
      const service = await ShopService.addService(shopId as string, {
        name,
        description,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined
      });
      res.status(201).json({ success: true, data: service, service, message: 'Service added successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const serviceId = req.params.serviceId;
      const updated = await ShopService.updateService(shopId as string, serviceId as string, req.body);
      res.status(200).json({ success: true, data: updated, service: updated, message: 'Service updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const serviceId = req.params.serviceId;
      await ShopService.deleteService(shopId as string, serviceId as string);
      res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getShopAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id;
      const analytics = await ShopService.getShopAnalytics(shopId as string);
      res.status(200).json({ success: true, data: analytics, analytics });
    } catch (error) {
      next(error);
    }
  }
};

