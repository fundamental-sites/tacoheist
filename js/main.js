document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const menuContainer = document.getElementById('menu-container');
    
    if (menuContainer && typeof menuData !== 'undefined') {
        menuContainer.innerHTML = '';

        menuData.forEach((cat) => {
            const panel = document.createElement('div');
            const catNameLower = cat.category.toLowerCase();
            const isSalsa = catNameLower.includes('salsa');
            const isBowl = catNameLower.includes('build your own bowl');
            
            panel.className = isSalsa ? 'panel salsa' : 'panel';

            let html = `
                <div class="panel-header">
                    <h3>${escapeHtml(cat.category)}</h3>
                    ${cat.price ? `<span class="cat-price">${escapeHtml(cat.price)}</span>` : ''}
                </div>
            `;
            
            if (cat.description) {
                html += `<p class="category-desc">${escapeHtml(cat.description)}</p>`;
            }

            if (cat.items && Array.isArray(cat.items)) {
                cat.items.forEach(item => {
                    if (isSalsa) {
                        html += `
                            <div class="item salsa-item">
                                <div class="item-top">
                                    <span class="item-title">${escapeHtml(item.name)}</span>
                                    ${item.price ? `<span class="salsa-badge">${escapeHtml(item.price)}</span>` : ''}
                                </div>
                                ${item.description ? `<p class="desc">${escapeHtml(item.description)}</p>` : ''}
                            </div>
                        `;
                    } else if (isBowl) {
                        html += `
                            <div class="item bowl-item">
                                <div class="item-top">
                                    <span class="item-title" style="font-weight:700; color:var(--gold);">${escapeHtml(item.name)}</span>
                                    <span class="bowl-tag">${escapeHtml(item.price)}</span>
                                </div>
                                ${item.description ? `<p class="desc">${escapeHtml(item.description)}</p>` : ''}
                            </div>
                        `;
                    } else {
                        html += `
                            <div class="item">
                                <div class="item-top">
                                    <span class="item-title">${escapeHtml(item.name)}</span>
                                    <span class="price">${escapeHtml(item.price || '')}</span>
                                </div>
                                ${item.description ? `<p class="desc">${escapeHtml(item.description)}</p>` : ''}
                            </div>
                        `;
                    }
                });
            }

            panel.innerHTML = html;
            menuContainer.appendChild(panel);
        });
    }

    // Order Modal Logic
    const orderUrl = "https://www.meandu.app/westfield-collective-mvo/counter";
    const modalHTML = `
        <div id="orderModal" class="order-modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
            <div class="order-modal-content" style="background: #18130d; color: #fff5e5; border: 1px solid #ffc34f; border-radius: 12px; padding: 32px; max-width: 460px; width: calc(100% - 32px); text-align: center;">
                <span style="display: inline-block; border: 1px solid rgba(255,195,79,0.4); color: #ffc34f; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 800; letter-spacing: .1em; margin-bottom: 15px;">SECURE PORTAL</span>
                <h3 style="color: #ffc34f; font-size: 20px; margin-bottom: 15px;">REDIRECTING TO ORDERING PORTAL</h3>
                <p style="color: #dfd4c3; font-size: 14.5px; line-height: 1.5; margin-bottom: 25px;">You are now leaving the Taco Heist site and being redirected to the secure online ordering portal for Westfield Collective.</p>
                <div style="display: flex; gap: 12px;">
                    <button id="proceedOrderBtn" class="btn" style="flex:1; background: #ffc34f; color: #14100b; border: 0; padding: 12px; font-weight: 900; border-radius: 5px; cursor: pointer;">CONTINUE TO ORDER</button>
                    <button id="cancelOrderBtn" class="btn btn-outline" style="flex:1; background: transparent; border: 1px solid #fff5e5; color: #fff5e5; padding: 12px; font-weight: 900; border-radius: 5px; cursor: pointer;">CANCEL</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('orderModal');
    document.querySelectorAll('.order-popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => { e.preventDefault(); if (modal) modal.style.display = 'flex'; });
    });
    document.getElementById('proceedOrderBtn')?.addEventListener('click', () => { window.open(orderUrl, '_blank', 'noopener'); if (modal) modal.style.display = 'none'; });
    document.getElementById('cancelOrderBtn')?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
});

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}