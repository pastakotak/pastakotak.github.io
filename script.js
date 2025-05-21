
function showOptions(id) {
  var optionsMenu = document.getElementById(id);
  optionsMenu.style.display = (optionsMenu.style.display === "none" || optionsMenu.style.display === "") ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = [
    { name: "Aglio Olio Roasted Chicken", price: 12 },
    { name: "Aglio Olio Beef Strips", price: 13 },
    { name: "Aglio Olio Prawn", price: 15 },
    { name: "Alfredo Roasted Chicken", price: 13 },
    { name: "Alfredo Beef Strips", price: 14 },
    { name: "Alfredo Prawn", price: 15 }
  ];

  const addOns = [
    { name: "Egg Yolk", price: 2 },
    { name: "Shiitake", price: 2 },
    { name: "Chicken", price: 3 },
    { name: "Prawn", price: 3 },
    { name: "Beef", price: 3 },
    { name: "Pasta", price: 2 },
    { name: "Cream", price: 2 },
    { name: "Parmesan", price: 2 }
  ];

  const orderBtn = document.getElementById("order-btn");
  const modal = document.getElementById("order-modal");
  const closeModalBtn = modal.querySelector(".close");
  const menuContainer = document.getElementById("menu-items");
  const totalPriceEl = document.getElementById("total-price");
  const orderSummary = document.getElementById("order-summary");
  const sendWhatsappBtn = document.getElementById("send-whatsapp");

  let orderData = {};

  // Create menu list with quantities and add-ons
  function createMenuList() {
    menuContainer.innerHTML = "";
    orderData = {};

    menuItems.forEach((item, index) => {
      orderData[item.name] = { quantity: 0, price: item.price, addOns: addOns.map(a => ({ ...a, quantity: 0 })) };

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("order-item");
      itemDiv.innerHTML = `
        <p>${item.name} - ${item.price} MYR</p>
        <div class="quantity-control">
          <button class="minus" data-index="${index}">-</button>
          <span id="qty-${index}">0</span>
          <button class="plus" data-index="${index}">+</button>
        </div>
        <div class="addons" data-menu="${item.name}">
          <p>Add-ons:</p>
          ${addOns.map((addOn, addOnIndex) => `
            <div>
              <label>${addOn.name} (+${addOn.price} MYR): </label>
              <input type="number" class="addon-qty" min="0" value="0" data-index="${index}" data-addon="${addOnIndex}" disabled>
            </div>
          `).join('')}
        </div>
      `;
      menuContainer.appendChild(itemDiv);
    });
  }

  // Update total price
  function updateTotalPrice() {
    let total = 0;
    Object.values(orderData).forEach(item => {
      total += item.quantity * item.price;
      item.addOns.forEach(addOn => {
        total += addOn.quantity * addOn.price;
      });
    });
    totalPriceEl.textContent = total.toLocaleString() + " MYR";
  }

  // Update order summary
  function updateOrderSummary() {
    orderSummary.innerHTML = "";
    Object.keys(orderData).forEach(key => {
      if (orderData[key].quantity > 0) {
        const li = document.createElement("li");
        const addOnsText = orderData[key].addOns
          .filter(addOn => addOn.quantity > 0)
          .map(addOn => `${addOn.name} x${addOn.quantity}`)
          .join(", ");

        li.textContent = `${key}: ${orderData[key].quantity} pcs${addOnsText ? ` (${addOnsText})` : ""}`;
        orderSummary.appendChild(li);
      }
    });
  }

  // Enable/Disable add-ons input
  function toggleAddOns(menuItemName, isEnabled) {
    document.querySelectorAll(`[data-menu="${menuItemName}"] .addon-qty`).forEach(input => {
      input.disabled = !isEnabled;
      if (!isEnabled) input.value = 0;
    });
  }

  // Open modal and initialize menu
  orderBtn.addEventListener("click", () => {
    createMenuList();
    updateTotalPrice();
    updateOrderSummary();
    modal.style.display = "block";
  });

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal on outside click
  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle quantity plus/minus clicks
  menuContainer.addEventListener("click", e => {
    const index = e.target.dataset.index;
    if (index !== undefined) {
      const menuItem = menuItems[index];
      const qtySpan = document.getElementById(`qty-${index}`);

      if (e.target.classList.contains("plus")) {
        orderData[menuItem.name].quantity++;
      } else if (e.target.classList.contains("minus") && orderData[menuItem.name].quantity > 0) {
        orderData[menuItem.name].quantity--;
      }

      qtySpan.textContent = orderData[menuItem.name].quantity;
      toggleAddOns(menuItem.name, orderData[menuItem.name].quantity > 0);
      updateTotalPrice();
      updateOrderSummary();
    }
  });

  // Handle add-on quantity changes
  menuContainer.addEventListener("input", e => {
    const index = e.target.dataset.index;
    const addOnIndex = e.target.dataset.addon;

    if (index !== undefined && addOnIndex !== undefined) {
      const menuItem = menuItems[index];
      const addOn = orderData[menuItem.name].addOns[addOnIndex];

      addOn.quantity = parseInt(e.target.value) || 0;
      updateTotalPrice();
      updateOrderSummary();
    }
  });

  // Send order to WhatsApp on button click
  sendWhatsappBtn.addEventListener("click", () => {
    const hasOrder = Object.values(orderData).some(item => item.quantity > 0);
    if (!hasOrder) {
      alert("Please add at least one item to your order.");
      return;
    }

    let message = "Hi! I'd like to place a pickup order:\n\nOrder Details:\n";
    Object.keys(orderData).forEach(key => {
      const item = orderData[key];
      if (item.quantity > 0) {
        const addOnsText = item.addOns
          .filter(addOn => addOn.quantity > 0)
          .map(addOn => `${addOn.name} x${addOn.quantity}`)
          .join(", ");
        message += `- ${key} x${item.quantity}${addOnsText ? ` (${addOnsText})` : ""}\n`;
      }
    });
    message += `\nTotal: ${totalPriceEl.textContent}`;

    const phoneNumber = "60123456789";  // Change to your WhatsApp number here!
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });

});

const popupOverlay = document.getElementById('seasonal-menu-popup');
const closePopupBtn = document.getElementById('closePopupBtn');

window.addEventListener('load', () => {
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 400);
});

closePopupBtn.addEventListener('click', () => {
  popupOverlay.classList.remove('show');
});

// Also close if clicked outside popup-content
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove('show');
  }
});
