import { motion } from "framer-motion";
import { useParams, useLocation } from "wouter";
import { Clock, CheckCircle, Circle, ChefHat, UtensilsCrossed, Star, ArrowLeft } from "lucide-react";
import { useGetOrder } from "@workspace/api-client-react";

const STATUSES = [
  { key: "pending", label: "Order Placed", icon: CheckCircle, description: "Your order has been received" },
  { key: "accepted", label: "Accepted", icon: CheckCircle, description: "Kitchen has accepted your order" },
  { key: "preparing", label: "Preparing", icon: ChefHat, description: "Chef is gathering ingredients" },
  { key: "cooking", label: "Cooking", icon: ChefHat, description: "Your food is being cooked" },
  { key: "ready", label: "Ready", icon: UtensilsCrossed, description: "Your order is ready!" },
  { key: "served", label: "Served", icon: Star, description: "Your food has been served. Enjoy!" },
  { key: "completed", label: "Completed", icon: CheckCircle, description: "Thank you for dining with us!" },
];

export default function Tracking() {
  const params = useParams<{ orderId: string }>();
  const [, setLocation] = useLocation();
  const orderId = parseInt(params.orderId ?? "0", 10);

  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
      queryKey: ["getOrder", orderId],
      refetchInterval: 5000,
    },
  });

  const currentIndex = STATUSES.findIndex((s) => s.key === order?.status) ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-muted-foreground mb-4">Order not found or an error occurred.</p>
          <button onClick={() => setLocation("/menu")} className="text-primary hover:underline text-sm">Back to Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <button onClick={() => setLocation("/menu")} className="flex items-center gap-2 text-muted-foreground hover:text-white mb-6 text-sm" data-testid="tracking-back">
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">Order #{order.id}</h1>
              <p className="text-muted-foreground text-sm">Table {order.tableNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-lg">₹{typeof order.total === 'number' ? order.total.toFixed(0) : order.total}</p>
              {order.estimatedMinutes && (
                <div className="flex items-center gap-1 text-muted-foreground text-xs justify-end">
                  <Clock className="w-3 h-3" />
                  <span>~{order.estimatedMinutes} min</span>
                </div>
              )}
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-full border border-primary/20 bg-primary/5 w-fit">
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary text-xs font-medium">Live Tracking — Updates every 5 seconds</span>
          </div>

          {/* Timeline */}
          <div className="relative mb-8">
            {STATUSES.map((status, i) => {
              const isDone = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={status.key} className="flex gap-4 mb-6" data-testid={`tracking-step-${status.key}`}>
                  {/* Icon & line */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0px rgba(255,43,43,0)", "0 0 20px rgba(255,43,43,0.6)", "0 0 0px rgba(255,43,43,0)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone ? "bg-primary border-primary" : "border-white/10 bg-white/5"
                      }`}
                    >
                      {isDone ? (
                        <status.icon className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/20" />
                      )}
                    </motion.div>
                    {i < STATUSES.length - 1 && (
                      <div className={`w-0.5 h-10 mt-1 transition-all ${isDone ? "bg-primary/50" : "bg-white/5"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className={`font-semibold text-sm ${isDone ? "text-white" : "text-white/30"}`}>{status.label}</p>
                    {isCurrent && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-xs mt-0.5">
                        {status.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order items */}
          <div className="p-5 rounded-2xl border border-white/5 mb-6" style={{ background: "rgba(17,17,17,0.8)" }}>
            <h2 className="text-white font-semibold mb-3">Order Items</h2>
            <div className="space-y-2">
              {(order.items as Array<{ name: string; quantity: number; unitPrice: number }>).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/70">{item.name} × {item.quantity}</span>
                  <span className="text-white font-medium">₹{(item.unitPrice * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {(order.status === "served" || order.status === "completed") && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLocation("/reviews")}
              data-testid="tracking-rate-button"
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 border border-primary/30 hover:bg-primary transition-all"
            >
              <Star className="w-4 h-4" /> Rate Your Experience
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
