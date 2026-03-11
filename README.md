<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PUBG MOBILE | MULTI-SHOP</title>
    <style>
        :root { --accent: #f3ab1c; --bg: #0a0b0d; --card: #15171a; --danger: #ff4444; }
        body { background: var(--bg); color: white; font-family: 'Arial Black', sans-serif; margin: 0; padding: 20px 20px 180px 20px; }
        
        .header { text-align: center; padding: 15px; border-bottom: 2px solid var(--accent); margin-bottom: 25px; }
        .header h1 { margin: 0; font-size: 1.2rem; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); }

        .user-input { max-width: 500px; margin: 10px auto 25px; }
        label { display: block; font-size: 0.7rem; color: #888; margin-bottom: 5px; text-transform: uppercase; }
        input { width: 100%; padding: 12px; background: #111; border: 1px solid #333; color: white; border-radius: 5px; box-sizing: border-box; outline: none; }
        input:focus { border-color: var(--accent); }

        .section-title { font-size: 0.85rem; text-transform: uppercase; margin: 20px 0 10px; color: #aaa; border-left: 3px solid var(--accent); padding-left: 10px; }
        
        .services { display: grid; grid-template-columns: 1fr; gap: 10px; max-width: 500px; margin: 0 auto; }
        
        .option { 
            background: var(--card); border: 1px solid #2d3035; padding: 15px; border-radius: 8px; 
            display: flex; justify-content: space-between; align-items: center; 
            text-decoration: none; color: inherit; transition: 0.2s;
        }
        .option:hover { border-color: var(--accent); background: #1c1f24; transform: translateY(-2px); }
        .option:active { transform: scale(0.98); }

        .info h3 { margin: 0; font-size: 0.85rem; color: #fff; text-transform: uppercase; }
        .info p { margin: 3px 0 0; font-size: 0.7rem; color: #666; }
        .price { color: var(--accent); font-weight: bold; font-size: 1rem; border: 1px solid var(--accent); padding: 4px 10px; border-radius: 4px; }

        .footer-panel { 
            position: fixed; bottom: 0; left: 0; right: 0; background: #0f1114; 
            padding: 20px; border-top: 2px solid var(--accent); text-align: center; z-index: 1000;
        }
        .warning-text { color: var(--danger); font-size: 0.7rem; text-transform: uppercase; font-weight: bold; }
    </style>
</head>
<body>

<div class="header">
    <h1>PUBG MOBILE MULTI-SHOP</h1>
</div>

<div class="user-input">
    <label>Данные для доставки</label>
    <input type="text" id="user_id" placeholder="Ваш Telegram или Player ID">
</div>

<div class="section-title">Валюта и пассы</div>
<div class="services">
    <!-- 300р -->
    <a href="https://yoomoney.ru/bill/pay/1GEAQVM8EN7.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>660 UC (Пополнение)</h3><p>По Player ID</p></div>
        <div class="price">300 ₽</div>
    </a>
    <!-- 300р -->
    <a href="https://yoomoney.ru/bill/pay/1GEAQVM8EN7.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>Обычный Royale Pass</h3><p>Доступ к сезону</p></div>
        <div class="price">300 ₽</div>
    </a>
    <!-- 600р -->
    <a href="https://yoomoney.ru/bill/pay/1GEART9MBGF.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>Royale Pass Elite</h3><p>Максимальный RP</p></div>
        <div class="price">600 ₽</div>
    </a>
</div>

<div class="section-title">Metro Royale</div>
<div class="services">
    <!-- 210р -->
    <a href="https://yoomoney.ru/bill/pay/1GEAR90BVTV.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>MK14 (Высшее)</h3><p>Стальной обвес</p></div>
        <div class="price">210 ₽</div>
    </a>
    <!-- 375р -->
    <a href="https://yoomoney.ru/bill/pay/1GEARDMN27T.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>Броня 6 уровня</h3><p>Шлем + Жилет (Сталь)</p></div>
        <div class="price">375 ₽</div>
    </a>
    <!-- 125р -->
    <a href="https://yoomoney.ru/bill/pay/1GEAQP8Q5KD.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>Рюкзак 6 уровня</h3><p>Макс. объем</p></div>
        <div class="price">125 ₽</div>
    </a>
    <!-- 550р -->
    <a href="https://yoomoney.ru/bill/pay/1GEARJCRG97.260311" class="option" onclick="return checkInput()">
        <div class="info"><h3>Комплект Кобры</h3><p>Топовый обвес</p></div>
        <div class="price">550 ₽</div>
    </a>
</div>

<div class="footer-panel">
    <div class="warning-text">⚠️ НАЖМИТЕ НА ТОВАР ДЛЯ ОПЛАТЫ<br>СНАЧАЛА УКАЖИТЕ ДАННЫЕ В ПОЛЕ ВЫШЕ</div>
</div>

<script>
    function checkInput() {
        var id = document.getElementById('user_id').value;
        if (!id || id.length < 3) {
            alert("Пожалуйста, введите ваш Telegram или Player ID перед выбором товара!");
            return false;
        }
        return true;
    }
</script>

</body>
</html>
