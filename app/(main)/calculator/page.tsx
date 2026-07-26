"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { 
  Calculator, Package, Globe, Anchor, Plane, Truck, Info, Save, Search, ChevronDown, ChevronUp, DollarSign
} from "lucide-react";
import Link from "next/link";

const SHIPPINGS = [
  { id: "sea", label: "Sea Freight", icon: Anchor },
  { id: "air", label: "Air Freight", icon: Plane },
  { id: "land", label: "Land Freight", icon: Truck },
];

const INCOTERMS = ["FOB", "CIF", "EXW", "DDP"];
const COUNTRIES = ["China", "United States", "India", "Germany", "United Kingdom", "Japan", "Vietnam"];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function CalculatorPage() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("USD");
  
  const [origin, setOrigin] = useState("China");
  const [destination, setDestination] = useState("United States");
  
  const [shippingMode, setShippingMode] = useState("sea");
  const [incoterm, setIncoterm] = useState("FOB");
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [weight, setWeight] = useState<number | "">("");
  const [volume, setVolume] = useState<number | "">("");

  // Sample Calculation Logic (Mock)
  const results = useMemo(() => {
    const qty = Number(quantity) || 0;
    const price = Number(unitPrice) || 0;
    
    if (qty === 0 || price === 0) return null;

    const productCost = qty * price;
    
    // Mock shipping cost based on mode
    let shippingMultiplier = 1;
    if (shippingMode === "air") shippingMultiplier = 5;
    if (shippingMode === "land") shippingMultiplier = 2;
    
    // Consider volume/weight if provided, else use rough estimates
    const vol = Number(volume) || (qty * 0.05); // Assume 0.05 CBM per unit if not set
    const baseShipping = shippingMode === "sea" ? 100 : 50; 
    
    let estimatedShipping = baseShipping + (vol * 50 * shippingMultiplier);
    
    // Duty based roughly on origin/dest mock rules (e.g. 10% average)
    let dutyRate = 0.10;
    if (origin === "China" && destination === "United States") dutyRate = 0.25;
    
    const estimatedDuty = productCost * dutyRate;
    
    // Insurance (e.g., 0.5% of product cost)
    const insurance = productCost * 0.005;
    
    // Other fees (Customs clearance, port handling)
    const otherFees = 150;
    
    let total = productCost;
    
    // Adjust based on Incoterm
    if (incoterm === "EXW") {
      total += estimatedShipping + estimatedDuty + insurance + otherFees;
    } else if (incoterm === "FOB") {
      total += estimatedShipping + estimatedDuty + insurance;
    } else if (incoterm === "CIF") {
      total += estimatedDuty + otherFees;
    } else if (incoterm === "DDP") {
      total = productCost; // simplification
    }

    // Reconstruct total for non-DDP to show user their out-of-pocket
    const outOfPocket = incoterm !== "DDP" ? (productCost + estimatedShipping + estimatedDuty + insurance + otherFees) : productCost;
    const costPerUnit = outOfPocket / qty;

    const chartData = [
      { name: "Product Cost", value: productCost },
      { name: "Shipping", value: estimatedShipping },
      { name: "Duty & Taxes", value: estimatedDuty },
      { name: "Insurance", value: insurance },
      { name: "Other Fees", value: otherFees },
    ];

    return {
      productCost,
      estimatedShipping,
      estimatedDuty,
      insurance,
      otherFees,
      total: outOfPocket,
      costPerUnit,
      chartData
    };
  }, [quantity, unitPrice, shippingMode, origin, destination, incoterm, volume, weight]);

  return (
    <div className="w-full pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-[#5cb85c] text-white rounded-xl shadow-md">
            <Calculator size={26} strokeWidth={2.5} />
          </div>
          Trade Cost Calculator
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Calculate your total landed costs including shipping, duties, and fees.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Input Form */}
        <div className="flex-1 w-full bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 lg:p-10">
          <div className="space-y-8">
            
            {/* Product Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 pb-2 border-b border-gray-50">
                <Package size={18} className="text-[#5cb85c]"/> Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-gray-700">Product Name</label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Wireless Headphones"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-gray-700">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Unit Price</label>
                  <div className="flex gap-3">
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all font-semibold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                    <input 
                      type="number" 
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Logistics */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2 pb-2 border-b border-gray-50">
                <Globe size={18} className="text-[#5cb85c]"/> Route & Logistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-gray-700">Origin Country</label>
                  <select 
                    value={origin} 
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-gray-700">Destination Country</label>
                  <select 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none transition-all"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2.5 md:col-span-2 pt-2">
                  <label className="text-sm font-semibold text-gray-700">Shipping Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SHIPPINGS.map(mode => (
                      <button 
                        key={mode.id}
                        onClick={() => setShippingMode(mode.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${shippingMode === mode.id ? 'border-[#5cb85c] bg-[#5cb85c] text-white shadow-md' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'}`}
                      >
                        <mode.icon size={22} className={shippingMode === mode.id ? "text-white" : "text-gray-400"} />
                        <span className="text-sm font-bold">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 md:col-span-2 pt-2">
                  <label className="text-sm font-semibold text-gray-700">Incoterm</label>
                  <div className="flex flex-wrap gap-3">
                    {INCOTERMS.map(term => (
                      <button 
                        key={term}
                        onClick={() => setIncoterm(term)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${incoterm === term ? 'border-[#5cb85c] bg-[#5cb85c] text-white shadow-md' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Advanced Options (Weight / Volume)
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-semibold text-gray-700">Total Weight (KG)</label>
                        <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                          placeholder="Optional"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-semibold text-gray-700">Total Volume (CBM)</label>
                        <input 
                          type="number" 
                          value={volume}
                          onChange={(e) => setVolume(e.target.value ? Number(e.target.value) : "")}
                          placeholder="Optional"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5cb85c]/20 focus:border-[#5cb85c] outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Right Side: Results Panel */}
        <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-6">
          <div className="bg-gray-900 text-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative border border-gray-800">
            
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign size={18} className="text-gray-400" /> Live Estimate
              </h3>

              {!results ? (
                <div className="py-16 flex flex-col items-center justify-center text-center opacity-60">
                  <Calculator size={56} strokeWidth={1} className="mb-5 text-gray-500" />
                  <p className="text-sm font-medium text-gray-400">Enter quantity and unit price to see calculation.</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Product Cost</span>
                      <span className="font-semibold">${results.productCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Est. Shipping ({shippingMode})</span>
                      <span className="font-semibold">${results.estimatedShipping.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-1">Duty & Taxes <Info size={12}/></span>
                      <span className="font-semibold">${results.estimatedDuty.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Insurance</span>
                      <span className="font-semibold">${results.insurance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Other Fees</span>
                      <span className="font-semibold">${results.otherFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 w-full" />

                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1.5 uppercase tracking-widest">Total Landed Cost</p>
                    <p className="text-4xl font-extrabold text-white tracking-tight">
                      ${results.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      ${results.costPerUnit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per unit
                    </p>
                  </div>

                  {/* Visual Breakdown (Recharts) */}
                  <div className="h-[120px] w-full mt-4 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={results.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {results.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 w-1/2">
                      {results.chartData.slice(0, 3).map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-gray-500 italic pl-3.5">+ more</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold rounded-xl transition-all shadow-md">
                      <Save size={18} /> Save Quote
                    </button>
                    <Link href="/" className="w-full flex items-center justify-center gap-2 py-3.5 bg-transparent hover:bg-gray-800 text-white font-bold rounded-xl transition-all border border-gray-700">
                      <Search size={18} /> Find Suppliers
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
