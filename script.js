// Функция для подключения кошелька
async function connectWallet() {
    try {
        // Проверяем наличие Ethereum провайдера
        if (window.ethereum) {
            // Запрашиваем подключение аккаунтов
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            // Успешное подключение
            console.log('Connected account:', accounts[0]);
            
            // Обновляем все кнопки
            updateAllButtons();
            
            return accounts[0];
        } else {
            // Если нет Ethereum провайдера, открываем страницу Trust Wallet
            window.open('https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph', '_blank');
            alert("Please install Trust Wallet extension to connect your wallet");
            return null;
        }
    } catch (error) {
        console.error('Connection error:', error);
        if (error.code === 4001) {
            alert("Connection rejected by user");
        } else {
            alert("Error connecting wallet: " + error.message);
        }
        return null;
    }
}

// Функция обновления всех кнопок
function updateAllButtons() {
    const buttons = ['claimBtn', 'btn2'];
    
    buttons.forEach(btnId => {
        const button = document.getElementById(btnId);
        if (button) {
            button.textContent = "CONNECTED";
            button.style.backgroundColor = "#00ff00";
            button.style.color = "#ffffffff";
            button.style.cursor = "default";
            button.onclick = null; // Убираем обработчик после подключения
        }
    });
}

// Назначаем обработчики при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для claimBtn
    const claimBtn = document.getElementById('claimBtn');
    if (claimBtn) {
        claimBtn.addEventListener('click', function(e) {
            e.preventDefault();
            connectWallet();
        });
    }
    
    // Обработчик для btn2
    const btn2 = document.getElementById('btn2');
    if (btn2) {
        btn2.addEventListener('click', function(e) {
            e.preventDefault();
            connectWallet();
        });
    }
    
    // Проверяем, уже подключен ли кошелек
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    updateAllButtons();
                }
            });
    }
});

// Функция для копирования текста с показом уведомления
function copyTextWithNotification(text, notificationElement) {
    // Используем современный API для копирования
    navigator.clipboard.writeText(text).then(function() {
        // Показываем уведомление
        notificationElement.classList.add('show');
        
        // Прячем уведомление через 2 секунды
        setTimeout(function() {
            notificationElement.classList.remove('show');
        }, 2000);
        
    }).catch(function(err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Показываем уведомление
        notificationElement.classList.add('show');
        setTimeout(function() {
            notificationElement.classList.remove('show');
        }, 2000);
    });
}

// Создаем уведомление о копировании
function createCopyNotification() {
    const notification = document.createElement('div');
    notification.id = 'copyNotification';
    notification.className = 'copy-notification';
    notification.textContent = 'Copied!';
    document.body.appendChild(notification);
    return notification;
}

// Инициализация функционала копирования
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.querySelector('.copy1');
    const addressElement = document.querySelector('.adress2');
    
    // Создаем уведомление
    const notification = createCopyNotification();
    
    // Добавляем обработчик на кнопку копирования
    if (copyButton && addressElement) {
        copyButton.addEventListener('click', function() {
            const addressText = addressElement.textContent;
            copyTextWithNotification(addressText, notification);
        });
    }
    
    // Добавляем CSS стили для уведомления
    const style = document.createElement('style');
    style.textContent = `
        .copy-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .copy-notification.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        .copy1 {
            cursor: pointer;
            transition: transform 0.2s ease;
        }


    `;
    document.head.appendChild(style);
});
