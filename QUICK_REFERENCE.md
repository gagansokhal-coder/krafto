# 🚀 Quick Reference Guide - Kraafto Integration

## What Was Fixed

| Issue | Status | Solution |
|-------|--------|----------|
| Frontend showing fake data | ✅ Fixed | Homepage now fetches from `/api/products/featured` |
| Promo codes not working | ✅ Fixed | Created validation endpoint + order integration |
| Inventory not decrementing | ✅ Fixed | Transaction-based inventory management in orders |
| Can't edit products | ✅ Fixed | Created PATCH `/api/admin/products/{id}` |
| Can't delete products | ✅ Fixed | Created DELETE endpoint with soft delete |
| Orders not visible | ✅ Fixed | Already working in both customer & admin panels |

---

## New API Endpoints

### For Customers
```bash
# Validate promo code
POST /api/promo-codes/validate
Body: { "code": "GIFT10", "subtotal": 5000 }
Response: { "valid": true, "discountAmount": 500 }

# Create order (now with inventory decrement)
POST /api/orders
Body: {
  "items": [{ "productId": "...", "quantity": 2 }],
  "promoCode": "GIFT10",
  "email": "customer@example.com",
  "phone": "+91-9876543210"
}
```

### For Admins
```bash
# Get product for editing
GET /api/admin/products/{id}

# Update product
PATCH /api/admin/products/{id}
Body: {
  "price": 10000,
  "inventory": 100,
  "isFeatured": true,
  "status": "ACTIVE"
}

# Delete product (soft delete)
DELETE /api/admin/products/{id}

# Update order status
PATCH /api/admin/orders/{id}/status
Body: {
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784"
}
```

---

## Admin Workflows

### Edit a Product
1. Go to `/admin/products`
2. Click pencil icon on any product
3. Modal opens with current values
4. Change price, inventory, status, badges
5. Click "Update Product"
6. Done! Changes visible everywhere

### Delete a Product
1. Go to `/admin/products`
2. Click trash icon on product
3. Confirm deletion
4. Product archived (soft delete)
5. Disappears from frontend
6. Old orders still show product name

### Create Promo Code
1. Go to `/admin/promo-codes`
2. Click "Create Promo Code"
3. Fill in:
   - Code: GIFT10
   - Type: Percentage
   - Value: 10
   - Min Order: ₹2000
   - Usage Limit: 100
4. Save
5. Customers can now use it

### Update Order Status
1. Go to `/admin/orders`
2. Click on an order
3. Change status: PENDING → CONFIRMED → SHIPPED → DELIVERED
4. Add tracking number
5. Save

---

## Customer Workflows

### Place an Order
1. Browse products (real data from database)
2. Add to cart
3. Enter promo code (validates in real-time)
4. Checkout
5. Order created:
   - Inventory decrements
   - Promo usage increments
   - Order saved
6. View order in `/account/orders`

### View Order History
1. Go to `/account/orders`
2. See all orders with:
   - Order number
   - Status
   - Items
   - Total

---

## Database Changes

### When Order is Placed:
```sql
-- Product inventory decrements
UPDATE products SET inventory = inventory - 2 WHERE id = 'A';

-- Promo code usage increments
UPDATE promo_codes SET usageCount = usageCount + 1 WHERE code = 'GIFT10';

-- Order created
INSERT INTO orders (...);
INSERT INTO order_items (...);
```

### When Product is Edited:
```sql
-- Product updated
UPDATE products 
SET price = 10000, 
    inventory = 100, 
    isFeatured = true 
WHERE id = 'A';
```

### When Product is Deleted:
```sql
-- Soft delete (not removed from database)
UPDATE products 
SET deletedAt = NOW(), 
    status = 'ARCHIVED' 
WHERE id = 'A';
```

---

## Files Changed

### Created:
- `src/app/api/admin/products/[id]/route.ts` - Edit/delete products
- `src/app/api/admin/orders/[id]/status/route.ts` - Update order status
- `src/app/api/promo-codes/validate/route.ts` - Validate promo codes

### Modified:
- `src/components/home/HomeClient.tsx` - Fetch real data
- `src/app/api/orders/route.ts` - Inventory decrement + promo tracking
- `src/app/admin/products/page.tsx` - Edit/delete buttons
- `src/components/admin/ProductForm.tsx` - Handle create & edit

---

## Testing Commands

### Test Promo Code
```bash
curl -X POST http://localhost:3000/api/promo-codes/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"GIFT10","subtotal":5000}'
```

### Test Product Update
```bash
curl -X PATCH http://localhost:3000/api/admin/products/{id} \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"price":10000,"inventory":100}'
```

### Test Order Creation
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"productId":"...","quantity":2}],
    "promoCode":"GIFT10",
    "email":"test@example.com",
    "phone":"+91-9876543210"
  }'
```

---

## Common Issues & Solutions

### Issue: Promo code not applying
**Solution:** Check:
- Code is active (`isActive: true`)
- Not expired (`validUntil` in future)
- Usage limit not reached
- Minimum order value met

### Issue: "Insufficient stock" error
**Solution:** Check product inventory in database:
```sql
SELECT inventory FROM products WHERE id = '...';
```

### Issue: Changes not visible on frontend
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R)
- Check API route has `export const dynamic = 'force-dynamic'`

### Issue: Can't edit product
**Solution:** Check:
- User has ADMIN or SUPER_ADMIN role
- Product exists in database
- Not trying to use duplicate slug

---

## Environment Variables

Make sure these are set in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/kraafto

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Payment
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Next Steps (Optional)

### Payment Integration
- Complete Stripe checkout
- Add webhook handlers
- Process refunds

### Email Notifications
- Order confirmation
- Shipping updates
- Password reset

### Advanced Features
- Bulk product import/export
- Product image uploads
- Review approval workflow
- Sales automation
- Gift card system

---

## Support

### Documentation Files:
- `FIXES_SUMMARY.md` - What was fixed
- `COMPLETE_INTEGRATION_FIX.md` - Detailed technical changes
- `SYSTEM_ARCHITECTURE.md` - Visual diagrams
- `QUICK_REFERENCE.md` - This file

### Key Directories:
- `/src/app/api/` - API routes
- `/src/app/admin/` - Admin panel pages
- `/src/app/account/` - Customer account pages
- `/src/components/` - Reusable components
- `/prisma/` - Database schema

---

## Summary

✅ **All core e-commerce features working**  
✅ **Frontend connected to database**  
✅ **Promo codes validate and apply**  
✅ **Inventory decrements on purchase**  
✅ **Admin can manage products**  
✅ **Orders visible everywhere**  

**Your e-commerce platform is ready to use!** 🎉
