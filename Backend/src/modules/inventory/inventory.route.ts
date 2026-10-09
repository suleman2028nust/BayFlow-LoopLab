import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { TenantGuard } from '../../common/middlewares/tenantGuard';
import { RBACGuard } from '../../common/middlewares/rbacGuard';

const router = Router({ mergeParams: true });

// Inventory list & manage
router.get('/', AuthGuard, TenantGuard, InventoryController.getInventory);
router.post('/', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'PARTS_PERSON', 'SERVICE_ADVISOR']), InventoryController.addPart);
router.patch('/:partId', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'PARTS_PERSON', 'SERVICE_ADVISOR']), InventoryController.updatePart);

// Purchase Orders
router.post('/purchase-orders', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'PARTS_PERSON', 'SERVICE_ADVISOR']), InventoryController.createPurchaseOrder);
router.get('/purchase-orders', AuthGuard, TenantGuard, InventoryController.listPurchaseOrders);
router.patch('/purchase-orders/:poId/receive', AuthGuard, TenantGuard, RBACGuard(['OWNER', 'PARTS_PERSON']), InventoryController.receivePurchaseOrder);

// Shortage check
router.post('/check-shortage', AuthGuard, TenantGuard, InventoryController.checkStockShortage);

export default router;
