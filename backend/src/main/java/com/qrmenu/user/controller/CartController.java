package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Cart;
import com.qrmenu.user.dto.CartRequestDTO;
import com.qrmenu.user.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequestDTO request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<List<Cart>> getCartByTable(@PathVariable Long tableId) {
        return ResponseEntity.ok(cartService.getCartByTable(tableId));
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable Long cartId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(cartId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @DeleteMapping("/clear/{tableId}")
    public ResponseEntity<String> clearCart(@PathVariable Long tableId) {
        cartService.clearCartByTable(tableId);
        return ResponseEntity.ok("Cart cleared");
    }
}