function checkTime() {
    let now = new Date();
    let malaysiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));

    let day = malaysiaTime.getDay();
    let hour = malaysiaTime.getHours();

    console.log("Malaysia Day:", day, "Hour:", hour);

    if (day === 5) {
        document.body.innerHTML = '<div class="message-container"><h3>🚧 We are closed on Fridays! 🚧</h3><p>See you on Saturday!</p></div>';
        return;
    }

    /* if (hour >= 18) {
        document.body.innerHTML = '<div class="message-container"><h3>🚧 Sorry, we are closed! 🚧</h3><p>Our operating hours are 12 PM - 6 PM.</p></div>';
        return;
    }
} /*

/* 
   This script checks the current hour and displays a 
   "Closed" message if it's outside operating hours (5 PM - 10 PM).
*/
if (hour < 2 || hour >= 22) {  
    document.body.innerHTML = '<div class="message-container"><h3>🚧 Sorry, we are closed! 🚧</h3><p>Our operating hours are 5 PM - 10 PM during Ramadan.</p></div>';  
    return;  
}
}

/* menu picture */
function showOptions(id) {
    const optionsMenu = document.getElementById(id);

    // Toggle visibility
    if (optionsMenu) {
        // Toggle visibility
        if (optionsMenu.style.display === "none" || optionsMenu.style.display === "") {
            optionsMenu.style.display = "block";
        } else {
            optionsMenu.style.display = "none";
        }
    }
}

// Ensure all options containers are hidden initially
document.addEventListener("DOMContentLoaded", () => {
    const optionContainers = document.querySelectorAll(".options-container");
    optionContainers.forEach(container => {
        container.style.display = "none";
    });
});

/*menu picture */
/* Toggle menu options */
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

    const DELIVERY_FEE = 3;
    let isDelivery = true; // Default to delivery

    const orderBtn = document.getElementById("order-btn");
    const modal = document.getElementById("order-modal");
    const closeModal = document.querySelector(".close");
    const menuContainer = document.getElementById("menu-items");
    const totalPriceEl = document.getElementById("total-price");
    const sendOrderBtn = document.getElementById("send-whatsapp");
    const orderSummary = document.getElementById("order-summary");

    let orderData = {};

    /** Update total price */
    function updateTotalPrice() {
        let total = 0;
        Object.values(orderData).forEach(item => {
            total += item.quantity * item.price;
            item.addOns.forEach(addOn => {
                total += addOn.quantity * addOn.price;
            });
        });

        if (isDelivery) {
            total += DELIVERY_FEE; // Add delivery charge if selected
        }

        totalPriceEl.textContent = total.toLocaleString() + " MYR";
    }

    /** Update order summary */
    function updateOrderSummary() {
        orderSummary.innerHTML = "";
        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                const li = document.createElement("li");
                const addOnsText = orderData[key].addOns
                    .filter(addOn => addOn.quantity > 0)
                    .map(addOn => `${addOn.name} x${addOn.quantity}`)
                    .join(", ");

                li.textContent = `${key}: ${orderData[key].quantity} pcs ${addOnsText ? `(${addOnsText})` : ""}`;
                orderSummary.appendChild(li);
            }
        });
    }

    /** Enable/Disable Add-ons based on quantity */
    function toggleAddOns(menuItemName, isEnabled) {
        document.querySelectorAll(`[data-menu="${menuItemName}"] .addon-qty`).forEach(input => {
            input.disabled = !isEnabled;
            if (!isEnabled) input.value = 0;
        });
    }

    /** Generate the menu list */
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

        menuContainer.innerHTML += `
            <p>Choose Order Type:</p>
            <label><input type="radio" name="order-type" value="Delivery" checked> Delivery (+${DELIVERY_FEE} MYR)</label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label><input type="radio" name="order-type" value="Pickup"> Pickup</label>
        `;
    
        // Attach event listener for order type selection
        document.querySelectorAll('input[name="order-type"]').forEach(radio => {
            radio.addEventListener("change", function () {
                isDelivery = this.value === "Delivery";
                updateTotalPrice();
                updateOrderSummary();
            });
        });
    }


    /** Open order modal */
    orderBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        createMenuList();
    });

    /** Close modal */
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    /** Handle quantity changes */
    menuContainer.addEventListener("click", function (event) {
        const index = event.target.dataset.index;
        if (index !== undefined) {
            const menuItem = menuItems[index];
            const quantityEl = document.getElementById(`qty-${index}`);

            if (event.target.classList.contains("plus")) {
                orderData[menuItem.name].quantity++;
            } else if (event.target.classList.contains("minus") && orderData[menuItem.name].quantity > 0) {
                orderData[menuItem.name].quantity--;
            }

            quantityEl.textContent = orderData[menuItem.name].quantity;
            toggleAddOns(menuItem.name, orderData[menuItem.name].quantity > 0);
            updateTotalPrice();
            updateOrderSummary();
        }
    });

    /** Handle add-on changes */
    menuContainer.addEventListener("input", function (event) {
        const index = event.target.dataset.index;
        const addOnIndex = event.target.dataset.addon;

        if (index !== undefined && addOnIndex !== undefined) {
            const menuItem = menuItems[index];
            const addOn = orderData[menuItem.name].addOns[addOnIndex];

            addOn.quantity = parseInt(event.target.value) || 0;
            updateTotalPrice();
            updateOrderSummary();
        }
    });

    /** Send order via WhatsApp */
    sendOrderBtn.addEventListener("click", function () {
        let orderText = "Hi! I'd like to order:\n";
        let hasOrder = false;

        Object.keys(orderData).forEach((key) => {
            if (orderData[key].quantity > 0) {
                hasOrder = true;
                let addOnsText = orderData[key].addOns
                    .filter(addOn => addOn.quantity > 0)
                    .map(addOn => `${addOn.name} x${addOn.quantity}`)
                    .join(", ");
                orderText += `- ${key}: ${orderData[key].quantity} pcs ${addOnsText ? `(${addOnsText})` : ""}\n`;
            }
        });

        if (!hasOrder) {
            alert("Please select at least one item.");
            return;
        }

        const selectedOrderType = document.querySelector('input[name="order-type"]:checked').value;
        orderText += `\nOrder Type: ${selectedOrderType}`;
        orderText += `\nTotal: ${totalPriceEl.textContent}`;

        const whatsappURL = `https://wa.me/60139529463?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, "_blank");
    });

    /** Background Music Play Button */
    const audio = document.getElementById("background-music");
    document.getElementById("play-music").addEventListener("click", function () {
        audio.volume = 0.5;
        audio.play();
    });
});

