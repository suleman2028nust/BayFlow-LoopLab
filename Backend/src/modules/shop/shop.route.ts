import { Router } from 'express';
import { ShopController } from './shop.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { RBACGuard } from '../../common/middlewares/rbacGuard';
import { TenantGuard } from '../../common/middlewares/tenantGuard';
import inventoryRoutes from '../inventory/inventory.route';

const router = Router();

// 1. Public: List all shops & Shop Details
router.get('/', ShopController.listAllShops);
router.get('/:shopId', ShopController.getShopById);

// 2. Owner creates a new shop
router.post('/', AuthGuard, RBACGuard(['OWNER']), ShopController.createShop);

// 3. Owner updates shop details
router.patch('/:shopId', AuthGuard, RBACGuard(['OWNER']), ShopController.updateShop);

// 4. Team Management
router.get('/:shopId/team', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'SERVICE_ADVISOR']), ShopController.getTeam);
router.post('/staff', AuthGuard, RBACGuard(['OWNER']), ShopController.addStaff);
router.post('/:shopId/team', AuthGuard, TenantGuard, RBACGuard(['OWNER']), ShopController.addStaff);
router.delete('/:shopId/team/:userId', AuthGuard, TenantGuard, RBACGuard(['OWNER']), ShopController.removeStaff);

// 4.1 Owner Analytics
router.get('/:shopId/analytics', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'SERVICE_ADVISOR']), ShopController.getShopAnalytics);

// 5. Slot system
router.get('/:shopId/slots', ShopController.getSlots);

// 6. Service Catalog
router.get('/:shopId/services', ShopController.listServices);
router.post('/:shopId/services', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'SERVICE_ADVISOR']), ShopController.addService);
router.patch('/:shopId/services/:serviceId', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'SERVICE_ADVISOR']), ShopController.updateService);
router.delete('/:shopId/services/:serviceId', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'SERVICE_ADVISOR']), ShopController.deleteService);

// 7. Inventory & PO routes
router.use('/:shopId/inventory', inventoryRoutes);
router.use('/:shopId', inventoryRoutes);

export default router;
