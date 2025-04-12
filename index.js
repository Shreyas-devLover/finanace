
async function pay(e) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    if (name === "" || email === "" || phone.length !== 10) {
        document.getElementById("phone").value = ''
        setTimeout(() => {
            document.getElementById("phone").value = phone;
        }, 500);
        return;
    }
    e.preventDefault();
    const res = await fetch("https://api.vinaiak.com/create-order")
    const response = await res.json()
    var options = {
        "key": "rzp_test_6M1c3gu3IsajYS", // Enter the Key ID generated from the Dashboard
        "amount": "900", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Finance Session", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": response.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            fetch("https://api.vinaiak.com/verify-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(response)
            }).then(res => res.json()).then(data => {
                if (data.success) {
                    alert("Payment Successful")
                } else {
                    alert("Payment Failed")
                }
            })
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name, //your customer's name
            email,
            contact: phone // customer's phone number
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    console.log(options);
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
}