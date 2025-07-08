import { useNavigate } from "react-router-dom";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../api"; // Import your API functions
import { showToast } from "../ToastNotification/ToastNotification";

export const handleRazorpayPayment = async (token, paymentData) => {
  try {
    // ✅ Step 1: Create an Order in the Backend
    const orderResponse = await createRazorpayOrder(token, paymentData);

    if (!orderResponse.order_id) {
      throw new Error("Failed to create Razorpay order");
    }

    const { order_id, amount, currency } = orderResponse;

    // ✅ Step 2: Load Razorpay SDK
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    razorpayScript.onload = async () => {
      const options = {
        key: "rzp_test_i0FyFCvdQZfy1U", // Replace with your Razorpay key
        amount: amount, // Razorpay expects amount in paise
        currency: currency,
        name: "Stay_Easy",
        description: "Booking Payment",
        order_id: order_id,
        handler: async function (response) {
          try {
            // ✅ Step 3: Verify Payment in Backend
            let { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
              response;
            let { listing_id, check_in, check_out, guests, amount } =
              paymentData;
            const verifyResponse = await verifyRazorpayPayment(token, {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              listing_id,
              check_in,
              check_out,
              guests,
              amount,
            });

            if (verifyResponse.success) {
              showToast("Payment successful! Booking confirmed.", "success");
              window.location.reload(); 
            } else {
              showToast(
                "Payment verification failed. Please contact support.",
                "error"
              );
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);
            showToast("Payment verification failed.", "error");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  } catch (error) {
    console.error("Payment Error:", error);
    showToast("Payment failed. Please try again.", "error");
  }
};
