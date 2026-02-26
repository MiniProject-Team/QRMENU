package com.qrmenu.user.service;

import com.qrmenu.shared.model.Cart;
import com.qrmenu.shared.repository.CartRepository;
import com.qrmenu.user.dto.CartRequestDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    // Add to cart
    public Cart addToCart(CartRequestDTO dto) {
        Cart cart = new Cart();
        cart.setTableId(dto.getTableId());
        cart.setItemId(dto.getItemId());
        cart.setQuantity(dto.getQuantity());
        return cartRepository.save(cart);
    }

    // Get cart by table
    public List<Cart> getCartByTable(Long tableId) {
        return cartRepository.findByTableId(tableId);
    }

    // Update quantity
    public Cart updateQuantity(Long cartId, int quantity) {
        Cart cart = cartRepository.findById(cartId).orElseThrow();
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    // Remove item
    public void removeItem(Long itemId) {
        List<Cart> carts = cartRepository.findByItemId(itemId);
        cartRepository.deleteAll(carts);
    }

    // Clear cart by table
    public void clearCartByTable(Long tableId) {
        List<Cart> cartItems = cartRepository.findByTableId(tableId);
        cartRepository.deleteAll(cartItems);
    }
}