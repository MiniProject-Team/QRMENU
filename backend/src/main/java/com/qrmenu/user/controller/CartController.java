package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Cart;
import com.qrmenu.user.dto.CartRequestDTO;
import com.qrmenu.user.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ✅ ADD TO CART
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequestDTO request) {
        Cart response = cartService.addToCart(request);
        return ResponseEntity.ok(response);
    }

    // ✅ GET CART BY TABLE ID
    @GetMapping("/{tableId}")
    public ResponseEntity<List<Cart>> getCartByTable(@PathVariable Long tableId) {
        List<Cart> cartList = cartService.getCartByTable(tableId);
        return ResponseEntity.ok(cartList);
    }

    // ✅ DELETE ITEM FROM CART
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.ok("Item removed from cart");
    }
}