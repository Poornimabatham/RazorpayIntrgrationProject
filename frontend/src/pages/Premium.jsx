import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/premium.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Premium() {
  const { user, refreshUser } = useAuth();

  const handleBuy = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/payment/create-order`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'DevTinder',
        description: data.plan === 'silver' ? 'Silver Membership' : 'Gold Membership',
        order_id: data.orderId,
        handler: async function (response) {
          await refreshUser();
          alert('🎉 Payment Successful! Welcome to ' + plan + ' membership!');
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999',
        },
        theme: { color: '#e91e8c' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-header">
        <h1>Choose Your Plan</h1>
        <p>Upgrade your experience with a membership</p>
        {user?.isPremium && (
          <div className="premium-badge">
            ✅ You are a {user.membershipType?.toUpperCase()} Member!
          </div>
        )}
      </div>
      <div className="plans-container">
        <div className="plan-card silver">
          <div className="plan-name">Silver Membership</div>
          <div className="plan-price">₹499</div>
          <ul className="plan-features">
            <li>Chat with other people</li>
            <li>100 connection requests/day</li>
            <li>Blue Tick</li>
            <li>3 months validity</li>
          </ul>
          <button className="plan-btn silver" onClick={() => handleBuy('silver')}>
            Buy Silver
          </button>
        </div>

        <div className="or-divider">OR</div>

        <div className="plan-card gold">
          <div className="plan-name">Gold Membership</div>
          <div className="plan-price">₹999</div>
          <ul className="plan-features">
            <li>Chat with other people</li>
            <li>Infinite connection requests/day</li>
            <li>Blue Tick</li>
            <li>6 months validity</li>
          </ul>
          <button className="plan-btn gold" onClick={() => handleBuy('gold')}>
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
}
