package com.qrmenu.user.controller;

import com.qrmenu.user.dto.CartRequestDTO;
import com.qrmenu.user.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    // ✅ Add item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequestDTO dto) {
        return ResponseEntity.ok(cartService.addToCart(dto));
    }

    // ✅ Get cart by table ID
    @GetMapping("/table/{tableId}")
    public ResponseEntity<?> getCartByTable(@PathVariable Long tableId) {
        return ResponseEntity.ok(cartService.getCartByTable(tableId));
    }

    // ✅ Update quantity
    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartId,
                                             @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(cartId, quantity));
    }

    // ✅ Remove item from cart
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok("Item removed from cart");
    }

    // ✅ Clear cart by table
    @DeleteMapping("/clear/{tableId}")
    public ResponseEntity<?> clearCart(@PathVariable Long tableId) {
        cartService.clearCartByTable(tableId);
        return ResponseEntity.ok("Cart cleared");
    }
}