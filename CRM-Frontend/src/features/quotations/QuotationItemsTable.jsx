// // src/features/quotations/QuotationItemsTable.jsx

// import { Fragment, useState, useMemo } from "react";
// import { Trash2, PackageSearch, Sparkles, BadgeCheck } from "lucide-react";
// import { formatINR } from "./quotationUtils";
// import API from "../../api/axios";

// function Metric({ label, value, accent }) {
//   const accents = {
//     default: "from-slate-50/50 to-white border-slate-200/60",
//     indigo: "from-[#37306B]/5 to-white border-[#37306B]/20",
//     emerald: "from-emerald-50/30 to-white border-emerald-100/40",
//   };

//   const valueColors = {
//     default: "text-slate-800",
//     indigo: "text-[#37306B]",
//     emerald: "text-emerald-600",
//   };

//   return (
//     <div className={`flex items-center gap-2.5 rounded-xl border bg-gradient-to-br px-4 py-2 backdrop-blur-sm ${accents[accent] || accents.default}`}>
//       <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500/80">{label}</span>
//       <span className={`text-sm font-black tabular-nums ${valueColors[accent] || valueColors.default}`}>
//         {typeof value === "string" ? value.replace(".00", "") : value}
//       </span>
//     </div>
//   );
// }

// function CellLabel({ children }) {
//   return (
//     <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 md:hidden">
//       {children}
//     </div>
//   );
// }

// function RowBadge({ children, tone = "slate" }) {
//   const classes = {
//     slate: "bg-slate-100 text-slate-500 ring-1 ring-slate-200/80",
//     indigo: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/70",
//     emerald: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70",
//     rose: "bg-rose-50 text-rose-500 ring-1 ring-rose-200/70",
//   };

//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
//         classes[tone] || classes.slate
//       }`}
//     >
//       {children}
//     </span>
//   );
// }

// const inputBase =
//   "w-full rounded-lg border-0 bg-transparent text-[12px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:bg-slate-50 focus:ring-1 focus:ring-slate-200/50";

// const subInputEnabled =
//   "border-0 bg-transparent text-slate-700 outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10";

// const disabledInput =
//   "cursor-not-allowed border-transparent bg-transparent text-slate-300 shadow-none";

// export default function QuotationItemsTable({
//   totals,
//   itemsList,
//   updateItem,
//   addItem,
//   removeItem,
//   formItems,
//   toggleSubItem,
//   updateSubItem,
//   autoSave,
//   onSkuSearch,
//   resetItems,
//   isEdit = false,
//   isDisabled = false,
// }) {
//   const summaryItemDescriptions = ["P & F", "I & C, Training"];

//   const regularRows = useMemo(() => {
//     const rows = totals?.rows || [];
//     const driverSku = "SE1000001";

//     return rows
//       .map((row, i) => {
//         // Robust SKU and description check for the driver
//         const sku = (row.sku || "").trim().toUpperCase();
//         const desc = (row.description || "").toLowerCase();
//         const isDriver = sku === driverSku || desc.includes("licensable driver");
//         const weight = isDriver ? 1000 : 0;

//         return { row, index: i, weight };
//       })
//       .filter(({ row }) => !summaryItemDescriptions.includes(row.description))
//       .sort((a, b) => {
//         const catA = (a.row.category || "General").toLowerCase().trim();
//         const catB = (b.row.category || "General").toLowerCase().trim();

//         // 1. Specific category priority (matching PDF)
//         if (catA === "test platform" && catB !== "test platform") return -1;
//         if (catB === "test platform" && catA !== "test platform") return 1;

//         // 2. Category sort
//         if (catA !== catB) {
//           return catA.localeCompare(catB);
//         }

//         // 3. Weight-based sort (Driver to bottom of category)
//         if (a.weight !== b.weight) return a.weight - b.weight;

//         // 4. Maintain original insertion order
//         return a.index - b.index;
//       });
//   }, [totals?.rows]);

//   const summaryRows = useMemo(() => {
//     const rows = totals?.rows || [];
//     return rows.map((row, i) => ({ row, index: i }))
//       .filter(({ row }) => summaryItemDescriptions.includes(row.description));
//   }, [totals?.rows]);

//   const rowsWithGroupInfo = useMemo(() => {
//     let groupIdx = -1;
//     let lastCat = null;
//     return regularRows.map((item) => {
//       const cat = (item.row.category || "General").toLowerCase().trim();
//       if (cat !== lastCat) {
//         groupIdx++;
//         lastCat = cat;
//       }
//       return { ...item, groupIdx };
//     });
//   }, [regularRows]);

//   const totalQuotationValue = useMemo(() => {
//     return regularRows.reduce((sum, { row }) => {
//       const qty = Number(row.qty || 1);
//       const price = Number(row.price || 0);
//       const discount = Number(row.discount || 0);
//       return sum + (qty * price * (1 - discount / 100));
//     }, 0);
//   }, [regularRows]);

//   const rowCount = totals?.rows?.length || 0;
//   const filledCount =
//     totals?.rows?.filter(
//       (row) => row.itemId || row.description || row.qty || row.price,
//     )?.length || 0;

//   const [skuQuery, setSkuQuery] = useState("");
//   const [skuResults, setSkuResults] = useState([]);
//   const [showSkuDropdown, setShowSkuDropdown] = useState(false);

//   const formatAmount = (value) => {
//     const amount = Number(value || 0);
//     return formatINR(Math.round(amount)).replace(".00", "");
//   };

//   return (
//     <div className="flex flex-col overflow-visible rounded-[28px] border border-slate-200/70 bg-white shadow-[0_20px_50px_rgba(55,48,107,0.08)]">
//       {/* HEADER */}
//       <div className="relative z-[50] overflow-visible border-b border-slate-100/80 px-4 py-3 lg:px-6">
//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_-10%,rgba(199,210,254,0.15),transparent_70%)]" />
//         <div className="relative flex flex-row items-center gap-4">
//           <div className="flex shrink-0 items-center gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
//               <Sparkles className="h-4 w-4 text-indigo-500" />
//             </div>
//             <div className="hidden lg:block">
//               <h2 className="text-base font-black tracking-tight text-[#37306B]">Item Breakdown</h2>
//               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Master Data Library</p>
//             </div>
//           </div>

//           <div className="relative flex min-w-0 flex-1 items-center gap-2">
//             <div className="relative flex-1">
//               <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 transition-all focus-within:border-[#37306B]/40 focus-within:bg-white focus-within:shadow-md">
//                 <PackageSearch className="h-4.5 w-4.5 text-slate-400" />
//                 <input
//                   type="text"
//                   value={skuQuery}
//                   placeholder={isDisabled ? "Search Log ID first..." : "Search SKU, name, make..."}
//                   disabled={isDisabled}
//                   onChange={async (e) => {
//                     const value = e.target.value;
//                     setSkuQuery(value);
//                     if (!value.trim()) {
//                       setSkuResults([]);
//                       setShowSkuDropdown(false);
//                       return;
//                     }
//                     try {
//                       const res = await API.get("/items/search", { params: { q: value } });
//                       const normalized = (res.data || []).filter(item => !item.parentId);
//                       setSkuResults(normalized);
//                       setShowSkuDropdown(true);
//                     } catch (err) {
//                       console.error("SKU search failed:", err);
//                     }
//                   }}
//                   className="w-full border-0 bg-transparent p-0 text-[14px] font-bold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
//                 />
//               </div>

//               {showSkuDropdown && skuResults.length > 0 && (
//                 <div
//                   className="absolute left-0 top-[calc(100%+8px)] z-[9999] flex w-[450px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl backdrop-blur-xl"
//                   style={{ maxHeight: "min(400px, 60vh)" }}
//                 >
//                   <div className="flex-1 overflow-y-auto p-1 scrollbar-thin">
//                     {skuResults.map((item) => (
//                       <button
//                         key={item.id}
//                         type="button"
//                         onClick={() => {
//                           const children = item.children || [];
//                           const hasParentPrice = Number(item.basePrice || item.price || 0) > 0;
//                           const hasBillableChildren = children.some(c => Number(c.basePrice || c.price || 0) > 0);
//                           const pricingMode = hasBillableChildren ? (hasParentPrice ? "parent_with_children" : "children_only") : "spec_rows";

//                           addItem({
//                             itemId: item.id,
//                             sku: item.sku || "",
//                             category: item.category || "",
//                             description: item.description || "",
//                             make: item.make || "",
//                             mfgPartNo: item.mfgPartNo || "",
//                             uom: item.uom || "",
//                             qty: 1,
//                             price: hasParentPrice ? Number(item.basePrice || item.price || 0) : 0,
//                             discount: Number(item.discount || 0),
//                             pricingMode,
//                             subItems: children,
//                             selectedSubItems: (pricingMode === "children_only" || pricingMode === "parent_with_children")
//                               ? children.map(c => ({
//                                   ...c,
//                                   itemId: c.id,
//                                   qty: Number(c.quantity || c.baseQty || c.qty || 1),
//                                  price: Number(
//   c.unitPrice || c.basePrice || c.price || 0,
// ),
//                                 }))
//                               : []
//                           });
//                           setSkuQuery("");
//                           setSkuResults([]);
//                           setShowSkuDropdown(false);
//                         }}
//                         className="group flex w-full flex-col rounded-xl px-3 py-2 text-left hover:bg-indigo-50/50"
//                       >
//                         <div className="flex items-center justify-between gap-2">
//                           <span className="font-mono text-[11px] font-black text-indigo-600">{item.sku}</span>
//                           <span className="text-[10px] font-bold text-emerald-600">{formatAmount(item.basePrice)}</span>
//                         </div>
//                         <div className="truncate text-[12px] font-medium text-slate-700">{item.name}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {!isEdit && (
//               <button
//                 onClick={resetItems}
//                 disabled={isDisabled}
//                 className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-black uppercase tracking-wider transition-colors ${
//                   isDisabled
//                     ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
//                     : "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
//                 }`}
//               >
//                 <Trash2 className="h-3 w-3" />
//                 Reset
//               </button>
//             )}
//           </div>

//         </div>
//       </div>

//       <div className="relative z-[1] flex flex-col overflow-visible rounded-b-[28px] border-t border-slate-100/70 bg-white">
//         <div
//           className="
//             overflow-x-auto
//             overflow-y-visible
//           "
//         >
//           <table
//             className="w-full table-fixed border-separate border-spacing-0 text-sm"
//             style={{
//               borderCollapse: "separate",
//               borderSpacing: "0",
//             }}
//           >
//             <colgroup>
//               <col style={{ width: "8%" }} />  {/* Category */}
//               <col style={{ width: "8%" }} />  {/* SKU */}
//               <col style={{ width: "21%" }} /> {/* Description */}
//               <col style={{ width: "6%" }} />  {/* Qty */}
//               <col style={{ width: "9%" }} />  {/* Unit Price */}
//               <col style={{ width: "9%" }} />  {/* Total Price */}
//               <col style={{ width: "6%" }} />  {/* Discount */}
//               <col style={{ width: "10%" }} /> {/* Final Price */}
//               <col style={{ width: "18%" }} /> {/* Remarks */}
//               <col style={{ width: "5%" }} />  {/* Del */}
//             </colgroup>

//             <thead className="sticky top-0 z-[20] bg-slate-50/95 backdrop-blur-xl">
//               <tr>
//                 {[
//                   { label: "Category", cls: "text-center" },
//                   { label: "SKU", cls: "text-center" },
//                   { label: "Item Description", cls: "text-center" },
//                   { label: "Qty", cls: "text-center" },
//                   { label: "Unit Price", cls: "text-center" },
//                   { label: "Total Price", cls: "text-center" },
//                   { label: "Discount", cls: "text-center" },
//                   { label: "Final Price", cls: "text-center" },
//                   { label: "Remarks", cls: "text-center" },
//                   { label: "Del", cls: "text-center" },
//                 ].map(({ label, cls = "" }) => (
//                   <th
//                     key={label}
//                     className={`border-b border-r border-slate-200/60 bg-white px-2 py-3.5 text-[13px] font-black tracking-tight text-[#37306B] backdrop-blur-md whitespace-nowrap last:border-r-0 ${cls}`}
//                   >
//                     {label}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="[&_tr:last-child_td]:border-b-0">
//               {rowsWithGroupInfo.map(({ row, index, groupIdx }, i) => {
//                 const selectedItem = itemsList.find(
//                   (i) => String(i.id) === String(row.itemId),
//                 );

//                   const hasDiscount = Number(row.discount || 0) > 0;
//                   const isAltGroup = groupIdx % 2 !== 0;

//                   const subItems = formItems[index]?.subItems || [];
//                   const subItemRowCount = subItems.reduce((acc, sub) => acc + (sub.description ? 2 : 1), 0);
//                   const totalRows = 1 + subItemRowCount;

//                   const pricingMode =
//                     formItems[index]?.pricingMode ||
//                     ((formItems[index]?.subItems || []).some(
//                       (sub) => Number(sub.basePrice || sub.price || 0) > 0,
//                     )
//                       ? Number(row.price || 0) > 0
//                         ? "parent_with_children"
//                         : "children_only"
//                       : "spec_rows");

//                   const isSelectableGroup =
//                     pricingMode === "parent_with_children" ||
//                     pricingMode === "children_only";

//                   const isFirstInCategory = i === 0 || rowsWithGroupInfo[i - 1].row.category !== row.category;

//                   let groupRowSpan = 0;
//                   if (isFirstInCategory) {
//                     for (let j = i; j < rowsWithGroupInfo.length; j++) {
//                       if (rowsWithGroupInfo[j].row.category !== row.category) break;
//                       const groupIndex = rowsWithGroupInfo[j].index;
//                       const subs = formItems[groupIndex]?.subItems || [];
//                       const subItemRows = subs.reduce((acc, s) => {
//                         const hasDesc = s.description && s.description.replace(/\s+/g, " ").trim() !== (s.name || "").replace(/\s+/g, " ").trim();
//                         return acc + (hasDesc ? 2 : 1);
//                       }, 0);
//                       groupRowSpan += 1 + subItemRows;
//                     }
//                   }

//                   return (
//                     <Fragment key={`row-${index}`}>
//                       {/* MAIN ROW */}
//                       <tr
//                         className={`group border-b border-slate-100/70 transition-all duration-200 ${
//                           hasDiscount
//                             ? "bg-gradient-to-r from-rose-50/40 via-rose-50/20 to-transparent hover:from-rose-50/60 hover:via-rose-50/30"
//                             : isAltGroup
//                             ? "bg-indigo-50/20 hover:bg-indigo-50/40"
//                             : "bg-white hover:bg-gradient-to-r hover:from-indigo-50/20 hover:via-slate-50/30 hover:to-transparent"
//                         }`}
//                       >
//                         {/* CATEGORY - CENTERED WITH ROWSPAN */}
//                         {isFirstInCategory && (
//                           <td
//                             rowSpan={groupRowSpan}
//                             className={`align-middle border-b border-r border-slate-100/70 px-5 py-3 text-center ${
//                               isAltGroup ? "bg-indigo-50/30" : "bg-slate-50/20"
//                             }`}
//                           >
//                             <div className="flex items-center justify-center">
//                               <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 leading-tight">
//                                 {row.category || "General"}
//                               </span>
//                             </div>
//                           </td>
//                         )}

//                         {/* SKU */}
//                         <td className="align-top border-b border-r border-slate-100/70 px-5 py-3 text-left">
//                           <div className="flex min-h-[32px] items-start">
//                             <span className="truncate font-mono text-[12px] font-bold tracking-tight text-slate-700">
//                               {row.sku || selectedItem?.sku || ""}
//                             </span>
//                           </div>
//                         </td>

//                         {/* DESCRIPTION */}
//                         <td className="align-top border-b border-r border-slate-100/70 px-3 py-2 text-left">
//                           <div className="min-h-[36px] w-full p-1 text-[12px] font-bold leading-relaxed text-slate-900 whitespace-pre-wrap">
//                             {row.description || (
//                               <span className="text-slate-300 italic font-normal">No description provided</span>
//                             )}
//                           </div>
//                         </td>

//                         {/* QTY */}
//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                           <CellLabel>Quantity</CellLabel>
//                           <input
//                             type="number"
//                             min="1"
//                             value={Number.isFinite(Number(row.qty)) ? row.qty : ""}
//                             onChange={(e) => updateItem(index, "qty", e.target.value)}
//                             onBlur={() => autoSave(formItems)}
//                             className={`${inputBase} h-10 px-2 text-right tabular-nums`}
//                           />
//                         </td>

//                         {/* UNIT PRICE */}
//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                           <CellLabel>Unit Price</CellLabel>
//                           <div className="relative">
//                             <input
//                               type="text"
//                               readOnly={!!row.itemId}
//                               value={Number.isFinite(Number(row.price)) ? formatAmount(row.price) : ""}
//                               onChange={(e) => {
//                                 const val = e.target.value.replace(/,/g, "");
//                                 if (!isNaN(val) || val === "") {
//                                   updateItem(index, "price", val);
//                                 }
//                               }}
//                               onBlur={() => autoSave(formItems)}
//                               className={`${inputBase} h-10 px-2 text-right tabular-nums ${
//                                 row.itemId ? "cursor-not-allowed bg-slate-50/50" : ""
//                               }`}
//                             />
//                           </div>
//                         </td>

//                         {/* TOTAL PRICE (Qty * Unit Price) */}
//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                           <CellLabel>Total Price</CellLabel>
//                           <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
//                             {formatAmount(
//                               Number(row.qty || 1) * Number(row.price || 0)
//                             )}
//                           </div>
//                         </td>

//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                           <CellLabel>Discount</CellLabel>
//                           <div className="relative">
//                             <input
//                               type="number"
//                               min="0"
//                               max="100"
//                               value={Number.isFinite(Number(row.discount)) ? row.discount : ""}
//                               onChange={(e) => updateItem(index, "discount", e.target.value)}
//                               onBlur={() => autoSave(formItems)}
//                               className={`${inputBase} h-10 py-2 pl-2 pr-7 text-right tabular-nums text-rose-600`}
//                             />
//                             <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-black text-rose-400/70">
//                               %
//                             </span>
//                           </div>
//                         </td>

//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                           <CellLabel>Final Price</CellLabel>
//                           <div className="flex h-10 items-center justify-end px-2 py-1 font-black tabular-nums text-[12px] text-[#37306B]">
//                             {formatAmount(
//                               Math.round(
//                                 Number(row.qty || 1) *
//                                   Number(row.price || 0) *
//                                   (1 - Number(row.discount || 0) / 100),
//                               ),
//                             )}
//                           </div>
//                         </td>

//                         {/* REMARKS */}
//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-1 text-left">
//                           <textarea
//                             rows={1}
//                             value={row.remarks ?? ""}
//                             onChange={(e) => {
//                               updateItem(index, "remarks", e.target.value);
//                               e.target.style.height = "auto";
//                               e.target.style.height = e.target.scrollHeight + "px";
//                             }}
//                             onBlur={() => autoSave(formItems)}
//                             onFocus={(e) => {
//                               e.target.style.height = "auto";
//                               e.target.style.height = e.target.scrollHeight + "px";
//                             }}
//                             className="w-full resize-none border-0 bg-transparent p-2 text-[12px] leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 overflow-hidden font-medium"
//                             placeholder="Add internal notes…"
//                           />
//                         </td>

//                         {/* DELETE */}
//                         <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-2 py-1.5 text-center last:border-r-0">
//                           {row.sku !== "SE1000001" && (
//                             <button
//                               onClick={() => removeItem(index)}
//                               className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-400 shadow-sm transition-all duration-200 hover:border-rose-200 hover:from-rose-100 hover:to-rose-200/60 hover:text-rose-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] active:scale-95"
//                               aria-label="Remove row"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </button>
//                           )}
//                         </td>
//                       </tr>

//                       {/* SUB-ITEM ROWS */}
//                       {subItems.length > 0 &&
//                         subItems
//                           .filter(
//                             (s) =>
//                               (s.sku || "").trim().toUpperCase() !==
//                               "SE1000001",
//                           )
//                           .map((sub) => {
//                           const selected = isSelectableGroup
//                             ? formItems[index].selectedSubItems.find(
//                                 (s) => s.id === (sub.id || sub.itemId),
//                               )
//                             : null;

//                           const checked = isSelectableGroup ? !!selected : true;

//                           return (
//                             <Fragment key={sub.id}>
//                               <tr
//                                 key={`${sub.id}-name`}
//                                 className={`border-b border-slate-50 transition-all duration-200 ${
//                                   isAltGroup ? "bg-indigo-50/10 hover:bg-indigo-50/20" : "bg-white hover:bg-slate-50/50"
//                                 }`}
//                               >
//                                 {(() => {
//                                   const hasDesc = sub.description && sub.description.replace(/\s+/g, " ").trim() !== (sub.name || "").replace(/\s+/g, " ").trim();
//                                   return (
//                                     <td
//                                       rowSpan={hasDesc ? 2 : 1}
//                                       className="align-top border-b border-r border-slate-100/60 px-5 py-3 text-left"
//                                     >
//                                       <div className="flex min-h-[32px] items-start">
//                                         <span
//                                           className={`whitespace-nowrap font-mono text-[12px] font-bold ${
//                                             checked || !isSelectableGroup
//                                               ? "text-slate-700"
//                                               : "text-slate-300"
//                                           }`}
//                                         >
//                                           {sub.sku || ""}
//                                         </span>
//                                       </div>
//                                     </td>
//                                   );
//                                 })()}
//                                 <td className={`align-top border-b border-r border-slate-100/70 px-3 py-2 ${
//                                   !checked && isSelectableGroup ? "opacity-40" : ""
//                                 }`}>
//                                   <div className={`text-[12px] font-medium leading-relaxed ${
//                                       checked || !isSelectableGroup
//                                         ? "text-slate-900"
//                                         : "text-slate-300"
//                                     }`}>{sub.name || ""}</div>
//                                 </td>
//                                 {row.category?.toLowerCase() === "test platform" ? (
//                                   <td colSpan={7} className="align-top border-b border-r border-slate-100/70 px-2 py-2 last:border-r-0"></td>
//                                 ) : (
//                                   <>
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                                       {(checked || !isSelectableGroup) && (
//                                         <input
//                                           type="number"
//                                           min="1"
//                                           value={Number.isFinite(Number(selected?.qty ?? sub.qty)) ? (selected?.qty ?? sub.qty) : 1}
//                                           onChange={(e) => updateSubItem(index, sub.id || sub.itemId, "qty", e.target.value)}
//                                           onBlur={() => autoSave(formItems)}
//                                           className={`${inputBase} h-10 px-2 text-right tabular-nums`}
//                                         />
//                                       )}
//                                     </td>
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                                       {(checked || !isSelectableGroup) && (
//                                         <input
//                                           type="text"
//                                           readOnly={true}
//                                           value={Number.isFinite(Number(selected?.price ?? sub.price)) ? formatAmount(selected?.price ?? sub.price) : "0"}
//                                           onChange={(e) => {
//                                             const val = e.target.value.replace(/,/g, "");
//                                             if (!isNaN(val) || val === "") {
//                                               updateSubItem(index, sub.id || sub.itemId, "price", val);
//                                             }
//                                           }}
//                                           onBlur={() => autoSave(formItems)}
//                                           className={`${inputBase} h-10 px-2 text-right tabular-nums cursor-not-allowed bg-slate-50/50`}
//                                         />
//                                       )}
//                                     </td>
//                                     {/* SUB-ITEM TOTAL PRICE */}
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                                       {(checked || !isSelectableGroup) && (
//                                         <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
//                                           {formatAmount(
//                                             Number((selected?.qty ?? sub.qty) || 1) * Number((selected?.price ?? sub.price) || 0)
//                                           )}
//                                         </div>
//                                       )}
//                                     </td>
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                                       {(checked || !isSelectableGroup) && (
//                                         <div className="relative">
//                                           <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={Number.isFinite(Number(selected?.discount ?? sub.discount)) ? (selected?.discount ?? sub.discount) : 0}
//                                             onChange={(e) => updateSubItem(index, sub.id || sub.itemId, "discount", e.target.value)}
//                                             onBlur={() => autoSave(formItems)}
//                                             className={`${inputBase} h-10 pl-2 pr-6 text-right tabular-nums text-rose-600`}
//                                           />
//                                           <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-400/70">%</span>
//                                         </div>
//                                       )}
//                                     </td>
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
//                                       {(checked || !isSelectableGroup) && (
//                                         <div className="flex h-10 items-center justify-end px-2 font-black tabular-nums text-[12px] text-slate-800">
//                                           {formatAmount(
//                                             Math.round(
//                                               Number((selected?.qty ?? sub.qty) || 1) *
//                                               Number((selected?.price ?? sub.price) || 0) *
//                                               (1 - Number((selected?.discount ?? sub.discount) || 0) / 100)
//                                             )
//                                           )}
//                                         </div>
//                                       )}
//                                     </td>
//                                     <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-left">
//                                       {(checked || !isSelectableGroup) && (
//                                         <textarea
//                                           value={selected?.remarks ?? sub.remarks ?? ""}
//                                           onChange={(e) => updateSubItem(index, sub.id || sub.itemId, "remarks", e.target.value)}
//                                           onBlur={() => autoSave(formItems)}
//                                           className="w-full min-h-[36px] border-0 bg-transparent p-1 text-[12px] text-slate-600 outline-none resize-none"
//                                           placeholder="Note..."
//                                         />
//                                       )}
//                                     </td>
//                                     <td className="align-top border-b border-slate-100/70 px-2 py-2 text-center">
//                                       {isSelectableGroup && (
//                                         <button
//                                           onClick={() => toggleSubItem(index, sub)}
//                                           className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200 ${
//                                             checked
//                                               ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
//                                               : "bg-slate-100 text-slate-400 hover:bg-slate-200"
//                                           }`}
//                                         >
//                                           {checked ? <BadgeCheck className="h-3.5 w-3.5" /> : <div className="h-2 w-2 rounded-full border-2 border-slate-300" />}
//                                         </button>
//                                       )}
//                                     </td>
//                                   </>
//                                 )}
//                               </tr>
// {sub.description &&
//   sub.description.replace(/\s+/g, " ").trim() !==
//     (sub.name || "").replace(/\s+/g, " ").trim() && (
//     <tr
//       key={`${sub.id}-desc`}
//       className={isAltGroup ? "bg-indigo-50/10 hover:bg-indigo-50/20" : "bg-white hover:bg-slate-50/50"}
//     >
//       {/* SKU cell is handled by rowSpan above */}

//       <td className="align-top border-r border-slate-100/70 px-3 pb-3">
//         <div className="max-w-2xl whitespace-pre-wrap text-[12px] font-normal leading-relaxed text-slate-500">
//           {sub.description}
//         </div>
//       </td>

//       <td colSpan={7}></td>
//     </tr>
// )}
//                             </Fragment>
//                           );
//                         })}
//                     </Fragment>
//                   );
//                 })}

//                 {/* TOTAL QUOTATION VALUE ROW */}
//                 {regularRows.length > 0 && (
//                   <tr className="bg-slate-100/30 font-bold border-t border-slate-200 text-[12px]">
//                     <td colSpan={2} className="px-5 py-2.5 border-r border-slate-200/60"></td>
//                     <td colSpan={5} className="px-5 py-2.5 text-left uppercase tracking-wider text-slate-500 text-[10px] border-r border-slate-200/60">Total Quotation Value</td>
//                     <td className="px-5 py-2.5 text-right text-slate-700 font-black border-r border-slate-200/60">{formatAmount(totalQuotationValue)}</td>
//                     <td colSpan={2}></td>
//                   </tr>
//                 )}

//                 {/* SUMMARY ROWS (P&F, I&C) */}
//                 {summaryRows.map(({ row, index }) => {
//                   const isPF = row.description === "P & F";
//                   const isIC = row.description === "I & C, Training";

//                   return (
//                     <tr
//                       key={`summary-${index}`}
//                       className="bg-white/40 hover:bg-slate-50/50 transition-colors border-t border-slate-100/50"
//                     >
//                       <td className="px-5 py-2.5 border-r border-slate-200/60"></td>
//                       <td className="px-5 py-2.5 border-r border-slate-200/60"></td>
//                       <td className="px-5 py-2.5 text-left font-bold text-slate-600 border-r border-slate-200/60 text-[12px]">{row.description}</td>

//                       {/* QTY */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
//                         {!isPF && (
//                           <input
//                             type="number"
//                             min="1"
//                             value={Number.isFinite(Number(row.qty)) ? row.qty : ""}
//                             onChange={(e) => updateItem(index, "qty", e.target.value)}
//                             onBlur={() => autoSave(formItems)}
//                             className={`${inputBase} h-10 px-2 text-right tabular-nums`}
//                           />
//                         )}
//                       </td>

//                       {/* UNIT PRICE */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
//                         <input
//                           type="text"
//                           value={Number.isFinite(Number(row.price)) ? formatAmount(row.price) : ""}
//                           onChange={(e) => {
//                             const val = e.target.value.replace(/,/g, "");
//                             if (!isNaN(val) || val === "") {
//                               updateItem(index, "price", val);
//                             }
//                           }}
//                           onBlur={() => autoSave(formItems)}
//                           className={`${inputBase} h-10 px-2 text-right tabular-nums`}
//                         />
//                       </td>

//                       {/* SUMMARY TOTAL PRICE */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
//                         <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
//                           {formatAmount(
//                             Number(row.qty || 1) * Number(row.price || 0)
//                           )}
//                         </div>
//                       </td>

//                       {/* DISCOUNT */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
//                         <div className="relative">
//                           {!isPF && (
//                             <>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 max="100"
//                                 value={Number.isFinite(Number(row.discount)) ? row.discount : ""}
//                                 onChange={(e) => updateItem(index, "discount", e.target.value)}
//                                 onBlur={() => autoSave(formItems)}
//                                 className={`${inputBase} h-10 py-2 pl-2 pr-7 text-right tabular-nums text-rose-600`}
//                               />
//                               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-black text-rose-400/70">
//                                 %
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </td>

//                       {/* FINAL PRICE */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right font-black tabular-nums text-[12px] text-[#37306B]">
//                         <div className="flex h-10 items-center justify-end px-2">
//                           {formatAmount(
//                             Math.round(
//                               Number(row.qty || 1) *
//                                 Number(row.price || 0) *
//                                 (1 - Number(row.discount || 0) / 100),
//                             ),
//                           )}
//                         </div>
//                       </td>

//                       {/* REMARKS */}
//                       <td className="align-top border-r border-slate-200/60 px-1.5 py-1 text-left">
//                         <textarea
//                           rows={1}
//                           value={row.remarks ?? ""}
//                           onChange={(e) => updateItem(index, "remarks", e.target.value)}
//                           onBlur={() => autoSave(formItems)}
//                           className="w-full resize-none border-0 bg-transparent p-2 text-[12px] leading-relaxed text-slate-700 outline-none overflow-hidden font-medium"
//                           placeholder="Add internal notes…"
//                         />
//                       </td>

//                       {/* DELETE */}
//                       <td className="align-top px-2 py-1.5 text-center">
//                         <button
//                           onClick={() => removeItem(index)}
//                           className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-400 shadow-sm transition-all duration-200 hover:border-rose-200 hover:from-rose-100 hover:to-rose-200/60 hover:text-rose-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] active:scale-95"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {/* GRAND TOTAL ROW */}
//                 <tr className="bg-[#37306B]/5 font-black text-[#37306B] border-t-2 border-[#37306B]/10 text-[12px]">
//                   <td colSpan={2} className="px-5 py-3 border-r border-slate-200/60"></td>
//                   <td colSpan={5} className="px-5 py-3 text-left uppercase tracking-[0.2em] text-[10px] border-r border-slate-200/60">Grand Total</td>
//                   <td className="px-5 py-3 text-right text-[13px] tracking-tight border-r border-slate-200/60">
//                     {formatAmount(totals?.grandTotal || 0)}
//                   </td>
//                   <td colSpan={2}></td>
//                 </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="border-t border-slate-100/80 bg-gradient-to-r from-slate-50/70 via-white/50 to-slate-50/30 px-3 py-2.5 sm:px-5 lg:px-6">
//         <div className="flex items-center justify-between gap-2.5 text-[11px] text-slate-400">
//           <span>All values update automatically as you edit the rows.</span>
//           <span className="hidden sm:inline">
//             Only selected sub-items are editable.
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function FragmentWrapper({ children }) {
//   return <>{children}</>;
// }

// src/features/quotations/QuotationItemsTable.jsx

import { Fragment, useState, useMemo } from "react";
import { Trash2, PackageSearch, Sparkles, BadgeCheck } from "lucide-react";
import { formatINR } from "./quotationUtils";
import API from "../../api/axios";

function Metric({ label, value, accent }) {
  const accents = {
    default: "from-slate-50/50 to-white border-slate-200/60",
    indigo: "from-[#37306B]/5 to-white border-[#37306B]/20",
    emerald: "from-emerald-50/30 to-white border-emerald-100/40",
  };

  const valueColors = {
    default: "text-slate-800",
    indigo: "text-[#37306B]",
    emerald: "text-emerald-600",
  };

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border bg-gradient-to-br px-4 py-2 backdrop-blur-sm ${accents[accent] || accents.default}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500/80">
        {label}
      </span>
      <span
        className={`text-sm font-black tabular-nums ${valueColors[accent] || valueColors.default}`}
      >
        {typeof value === "string" ? value.replace(".00", "") : value}
      </span>
    </div>
  );
}

function CellLabel({ children }) {
  return (
    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 md:hidden">
      {children}
    </div>
  );
}

function RowBadge({ children, tone = "slate" }) {
  const classes = {
    slate: "bg-slate-100 text-slate-500 ring-1 ring-slate-200/80",
    indigo: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/70",
    emerald: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70",
    rose: "bg-rose-50 text-rose-500 ring-1 ring-rose-200/70",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
        classes[tone] || classes.slate
      }`}
    >
      {children}
    </span>
  );
}

const inputBase =
  "w-full rounded-lg border-0 bg-transparent text-[12px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:bg-slate-50 focus:ring-1 focus:ring-slate-200/50";

const subInputEnabled =
  "border-0 bg-transparent text-slate-700 outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/10";

const disabledInput =
  "cursor-not-allowed border-transparent bg-transparent text-slate-300 shadow-none";

export default function QuotationItemsTable({
  totals,
  itemsList,
  updateItem,
  addItem,
  removeItem,
  formItems,
  toggleSubItem,
  updateSubItem,
  autoSave,
  onSkuSearch,
  resetItems,
  isEdit = false,
  isDisabled = false,
}) {
  const summaryItemDescriptions = ["P & F", "I & C, Training"];

  // const regularRows = useMemo(() => {
  //   const rows = totals?.rows || [];
  //   const driverSku = "SE1000001";

  //   return rows
  //     .map((row, i) => {
  //       const sku = (row.sku || "").trim().toUpperCase();
  //       const desc = (row.description || "").toLowerCase();
  //       const name = (row.name || "").toLowerCase();
  //       // Extremely broad check to catch the driver row
  //       const isDriver =
  //         sku === "SE1000001" ||
  //         desc.includes("licensable driver") ||
  //         desc.includes("tool monitor") ||
  //         name.includes("licensable driver") ||
  //         name.includes("tool monitor");
  //       const weight = isDriver ? 1000000 : 0; // Very high weight
  //       return { row, index: i, weight };
  //     })
  //     .filter(({ row }) => !summaryItemDescriptions.includes(row.description))
  //     .sort((a, b) => {
  //       const catA = (a.row.category || "").trim().toLowerCase();
  //       const catB = (b.row.category || "").trim().toLowerCase();

  //       if (catA < catB) return -1;
  //       if (catA > catB) return 1;

  //       // Same category? Put driver at the bottom
  //       if (a.weight !== b.weight) return a.weight - b.weight;

  //       return a.index - b.index;
  //     });
  // }, [totals?.rows]);

  const regularRows = useMemo(() => {
    const rows = totals?.rows || [];
    const driverSku = "SE1000001";

    return rows
      .map((row, i) => {
        const sku = (row.sku || "").trim().toUpperCase();
        const desc = (row.description || "").toLowerCase();
        const name = (row.name || "").toLowerCase();

        // Extremely broad check to catch the driver row
        const isDriver =
          sku === "SE1000001" ||
          desc.includes("licensable driver") ||
          desc.includes("tool monitor") ||
          name.includes("licensable driver") ||
          name.includes("tool monitor");

        const weight = isDriver ? 1000000 : 0;

        return { row, index: i, weight };
      })
      .filter(({ row }) => !summaryItemDescriptions.includes(row.description))
      .sort((a, b) => {
        // Keep original insertion order
        // Only keep driver item at bottom
        if (a.weight !== b.weight) {
          return a.weight - b.weight;
        }

        return a.index - b.index;
      });
  }, [totals?.rows]);

  const summaryRows = useMemo(() => {
    const rows = totals?.rows || [];
    return rows
      .map((row, i) => ({ row, index: i }))
      .filter(({ row }) => summaryItemDescriptions.includes(row.description));
  }, [totals?.rows]);

  const rowsWithGroupInfo = useMemo(() => {
    let groupIdx = -1;
    let lastCat = null;
    return regularRows.map((item) => {
      const cat = (item.row.category || "General").toLowerCase().trim();
      if (cat !== lastCat) {
        groupIdx++;
        lastCat = cat;
      }
      return { ...item, groupIdx };
    });
  }, [regularRows]);

  // const totalQuotationValue = useMemo(() => {
  //   return regularRows.reduce((sum, { row }) => {
  //     const qty = Number(row.qty || 1);
  //     const price = Number(row.price || 0);
  //     const discount = Number(row.discount || 0);
  //     return sum + (qty * price * (1 - discount / 100));
  //   }, 0);
  // }, [regularRows]);

  const totalQuotationValue = useMemo(() => {
    return regularRows.reduce((sum, { row, index }) => {
      // ✅ PARENT TOTAL
      const parentTotal =
        Number(row.qty || 1) *
        Number(row.price || 0) *
        (1 - Number(row.discount || 0) / 100);

      // ✅ SUB ITEMS
      const subItems = formItems[index]?.selectedSubItems?.length
        ? formItems[index].selectedSubItems
        : formItems[index]?.subItems || [];

      const subTotal = subItems.reduce((subSum, sub) => {
        return (
          subSum +
          Number(sub.qty || sub.quantity || 1) *
            Number(sub.price || 0) *
            (1 - Number(sub.discount || 0) / 100)
        );
      }, 0);

      return sum + parentTotal + subTotal;
    }, 0);
  }, [regularRows, formItems]);

  const rowCount = totals?.rows?.length || 0;
  const filledCount =
    totals?.rows?.filter(
      (row) => row.itemId || row.description || row.qty || row.price,
    )?.length || 0;

  const [skuQuery, setSkuQuery] = useState("");
  const [skuResults, setSkuResults] = useState([]);
  const [showSkuDropdown, setShowSkuDropdown] = useState(false);

  const formatAmount = (value) => {
    const amount = Number(value || 0);
    return formatINR(Math.round(amount)).replace(".00", "");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-visible rounded-[28px] border border-slate-200/70 bg-white shadow-[0_20px_50px_rgba(55,48,107,0.08)]">
      {/* HEADER */}
      <div className="relative z-[50] overflow-visible border-b border-slate-100/80 px-4 py-3 lg:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_-10%,rgba(199,210,254,0.15),transparent_70%)]" />
        <div className="relative flex flex-row items-center gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-base font-black tracking-tight text-[#37306B]">
                Item Breakdown
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                Master Data Library
              </p>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-1 items-center gap-2">
            <div className="relative flex-1">
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 transition-all focus-within:border-[#37306B]/40 focus-within:bg-white focus-within:shadow-md">
                <PackageSearch className="h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={skuQuery}
                  placeholder={
                    isDisabled
                      ? "Search Log ID first..."
                      : "Search SKU, name, make..."
                  }
                  disabled={isDisabled}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSkuQuery(value);
                    if (!value.trim()) {
                      setSkuResults([]);
                      setShowSkuDropdown(false);
                      return;
                    }
                    try {
                      const res = await API.get("/items/search", {
                        params: { q: value },
                      });
                      const normalized = (res.data || []).filter(
                        (item) => !item.parentId,
                      );
                      setSkuResults(normalized);
                      setShowSkuDropdown(true);
                    } catch (err) {
                      console.error("SKU search failed:", err);
                    }
                  }}
                  className="w-full border-0 bg-transparent p-0 text-[14px] font-bold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>

              {showSkuDropdown && skuResults.length > 0 && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-[9999] flex w-[450px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl backdrop-blur-xl"
                  style={{ maxHeight: "min(400px, 60vh)" }}
                >
                  <div className="flex-1 overflow-y-auto p-1 scrollbar-thin">
                    {skuResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          const children = item.children || [];
                          const hasParentPrice =
                            Number(item.basePrice || item.price || 0) > 0;
                          const hasBillableChildren = children.some(
                            (c) => Number(c.basePrice || c.price || 0) > 0,
                          );
                          const pricingMode = hasBillableChildren
                            ? hasParentPrice
                              ? "parent_with_children"
                              : "children_only"
                            : "spec_rows";

                          addItem({
                            itemId: item.id,
                            sku: item.sku || "",
                            category: item.category || "",
                            description: item.description || "",
                            make: item.make || "",
                            mfgPartNo: item.mfgPartNo || "",
                            uom: item.uom || "",
                            qty: 1,
                            price: hasParentPrice
                              ? Number(item.basePrice || item.price || 0)
                              : 0,
                            discount: Number(item.discount || 0),
                            pricingMode,
                            subItems: children,
                            selectedSubItems:
                              pricingMode === "children_only" ||
                              pricingMode === "parent_with_children"
                                ? children.map((c) => ({
                                    ...c,
                                    itemId: c.id,
                                    qty: Number(
                                      c.quantity || c.baseQty || c.qty || 1,
                                    ),
                                    price: Number(
                                      c.unitPrice ||
                                        c.basePrice ||
                                        c.price ||
                                        0,
                                    ),
                                  }))
                                : [],
                          });
                          setSkuQuery("");
                          setSkuResults([]);
                          setShowSkuDropdown(false);
                        }}
                        className="group flex w-full flex-col rounded-xl px-3 py-2 text-left hover:bg-indigo-50/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-black text-indigo-600">
                            {item.sku}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            {formatAmount(item.basePrice)}
                          </span>
                        </div>
                        <div className="truncate text-[12px] font-medium text-slate-700">
                          {item.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isEdit && (
              <button
                onClick={resetItems}
                disabled={isDisabled}
                className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  isDisabled
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
              >
                <Trash2 className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-[28px] border-t border-slate-100/70 bg-white">
        <div
          className="
            flex-1
            overflow-x-auto
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-slate-300
            scrollbar-track-slate-100
            hover:scrollbar-thumb-slate-400
          "
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#94a3b8 #e2e8f0",
          }}
        >
          <table
            className="w-full table-fixed border-separate border-spacing-0 text-sm"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0",
            }}
          >
            <colgroup>
              <col style={{ width: "8%" }} /> {/* Category */}
              <col style={{ width: "8%" }} /> {/* SKU */}
              <col style={{ width: "21%" }} /> {/* Description */}
              <col style={{ width: "6%" }} /> {/* Qty */}
              <col style={{ width: "9%" }} /> {/* Unit Price */}
              <col style={{ width: "9%" }} /> {/* Total Price */}
              <col style={{ width: "6%" }} /> {/* Discount */}
              <col style={{ width: "10%" }} /> {/* Final Price */}
              <col style={{ width: "18%" }} /> {/* Remarks */}
              <col style={{ width: "5%" }} /> {/* Del */}
            </colgroup>

            <thead className="sticky top-0 z-[20] bg-slate-50/95 backdrop-blur-xl">
              <tr>
                {[
                  { label: "Category", cls: "text-center" },
                  { label: "SKU", cls: "text-center" },
                  { label: "Item Description", cls: "text-center" },
                  { label: "Qty", cls: "text-center" },
                  { label: "Unit Price", cls: "text-center" },
                  { label: "Total Price", cls: "text-center" },
                  { label: "Discount", cls: "text-center" },
                  { label: "Final Price", cls: "text-center" },
                  { label: "Remarks", cls: "text-center" },
                  { label: "Del", cls: "text-center" },
                ].map(({ label, cls = "" }) => (
                  <th
                    key={label}
                    className={`border-b border-r border-slate-200/60 bg-white px-2 py-3.5 text-[13px] font-black tracking-tight text-[#37306B] backdrop-blur-md whitespace-nowrap last:border-r-0 ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="[&_tr:last-child_td]:border-b-0">
              {rowsWithGroupInfo.map(({ row, index, groupIdx }, i) => {
                const selectedItem = itemsList.find(
                  (i) => String(i.id) === String(row.itemId),
                );

                const hasDiscount = Number(row.discount || 0) > 0;
                const isAltGroup = groupIdx % 2 !== 0;

                const subItems = formItems[index]?.subItems || [];
                const subItemRowCount = subItems.reduce(
                  (acc, sub) => acc + (sub.description ? 2 : 1),
                  0,
                );
                const totalRows = 1 + subItemRowCount;

                const pricingMode =
                  formItems[index]?.pricingMode ||
                  ((formItems[index]?.subItems || []).some(
                    (sub) => Number(sub.basePrice || sub.price || 0) > 0,
                  )
                    ? Number(row.price || 0) > 0
                      ? "parent_with_children"
                      : "children_only"
                    : "spec_rows");

                const isSelectableGroup =
                  pricingMode === "parent_with_children" ||
                  pricingMode === "children_only";

                const isFirstInCategory =
                  i === 0 ||
                  rowsWithGroupInfo[i - 1].row.category !== row.category;

                let groupRowSpan = 0;
                if (isFirstInCategory) {
                  for (let j = i; j < rowsWithGroupInfo.length; j++) {
                    if (rowsWithGroupInfo[j].row.category !== row.category)
                      break;
                    const groupIndex = rowsWithGroupInfo[j].index;
                    const subs = formItems[groupIndex]?.subItems || [];
                    const subItemRows = subs.reduce((acc, s) => {
                      const hasDesc =
                        s.description &&
                        s.description.replace(/\s+/g, " ").trim() !==
                          (s.name || "").replace(/\s+/g, " ").trim();
                      return acc + (hasDesc ? 2 : 1);
                    }, 0);
                    groupRowSpan += 1 + subItemRows;
                  }
                }

                return (
                  <Fragment key={`row-${index}`}>
                    {/* MAIN ROW */}
                    <tr
                      className={`group border-b border-slate-100/70 transition-all duration-200 ${
                        hasDiscount
                          ? "bg-gradient-to-r from-rose-50/40 via-rose-50/20 to-transparent hover:from-rose-50/60 hover:via-rose-50/30"
                          : isAltGroup
                            ? "bg-indigo-50/20 hover:bg-indigo-50/40"
                            : "bg-white hover:bg-gradient-to-r hover:from-indigo-50/20 hover:via-slate-50/30 hover:to-transparent"
                      }`}
                    >
                      {/* CATEGORY - CENTERED WITH ROWSPAN */}
                      {isFirstInCategory && (
                        <td
                          rowSpan={groupRowSpan}
                          className={`align-middle border-b border-r border-slate-100/70 px-5 py-3 text-center ${
                            isAltGroup ? "bg-indigo-50/30" : "bg-slate-50/20"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 leading-tight">
                              {row.category || "General"}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* SKU */}
                      <td className="align-top border-b border-r border-slate-100/70 px-5 py-3 text-left">
                        <div className="flex min-h-[32px] items-start">
                          <span className="truncate font-mono text-[12px] font-bold tracking-tight text-slate-700">
                            {row.sku || selectedItem?.sku || ""}
                          </span>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="align-top border-b border-r border-slate-100/70 px-3 py-2 text-left">
                        <div className="min-h-[36px] w-full p-1 text-[12px] font-bold leading-relaxed text-slate-900 whitespace-pre-wrap">
                          {row.description || (
                            <span className="text-slate-300 italic font-normal">
                              No description provided
                            </span>
                          )}
                        </div>
                      </td>

                      {/* QTY */}
                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                        <CellLabel>Quantity</CellLabel>
                        <input
                          type="number"
                          min="1"
                          value={
                            Number.isFinite(Number(row.qty)) ? row.qty : ""
                          }
                          onChange={(e) =>
                            updateItem(index, "qty", e.target.value)
                          }
                          onBlur={() => autoSave(formItems)}
                          className={`${inputBase} h-10 px-2 text-right tabular-nums`}
                        />
                      </td>

                      {/* UNIT PRICE */}
                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                        <CellLabel>Unit Price</CellLabel>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly={!!row.itemId}
                            value={
                              Number.isFinite(Number(row.price))
                                ? formatAmount(row.price)
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value.replace(/,/g, "");
                              if (!isNaN(val) || val === "") {
                                updateItem(index, "price", val);
                              }
                            }}
                            onBlur={() => autoSave(formItems)}
                            className={`${inputBase} h-10 px-2 text-right tabular-nums ${
                              row.itemId
                                ? "cursor-not-allowed bg-slate-50/50"
                                : ""
                            }`}
                          />
                        </div>
                      </td>

                      {/* TOTAL PRICE (Qty * Unit Price) */}
                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                        <CellLabel>Total Price</CellLabel>
                        <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
                          {formatAmount(
                            Number(row.qty || 1) * Number(row.price || 0),
                          )}
                        </div>
                      </td>

                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                        <CellLabel>Discount</CellLabel>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={
                              Number.isFinite(Number(row.discount))
                                ? row.discount
                                : ""
                            }
                            onChange={(e) =>
                              updateItem(index, "discount", e.target.value)
                            }
                            onBlur={() => autoSave(formItems)}
                            className={`${inputBase} h-10 py-2 pl-2 pr-7 text-right tabular-nums text-rose-600`}
                          />
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-black text-rose-400/70">
                            %
                          </span>
                        </div>
                      </td>

                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                        <CellLabel>Final Price</CellLabel>
                        <div className="flex h-10 items-center justify-end px-2 py-1 font-black tabular-nums text-[12px] text-[#37306B]">
                          {formatAmount(
                            Math.round(
                              Number(row.qty || 1) *
                                Number(row.price || 0) *
                                (1 - Number(row.discount || 0) / 100),
                            ),
                          )}
                        </div>
                      </td>

                      {/* REMARKS */}
                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-1.5 py-1 text-left">
                        <textarea
                          rows={1}
                          value={row.remarks ?? ""}
                          onChange={(e) => {
                            updateItem(index, "remarks", e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                          onBlur={() => autoSave(formItems)}
                          onFocus={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                          className="w-full resize-none border-0 bg-transparent p-2 text-[12px] leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 overflow-hidden font-medium"
                          placeholder="Add internal notes…"
                        />
                      </td>

                      {/* DELETE */}
                      <td className="align-top whitespace-normal break-words border-b border-r border-slate-100/70 px-2 py-1.5 text-center last:border-r-0">
                        <button
                          onClick={() => removeItem(index)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-400 shadow-sm transition-all duration-200 hover:border-rose-200 hover:from-rose-100 hover:to-rose-200/60 hover:text-rose-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] active:scale-95"
                          aria-label="Remove row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* SUB-ITEM ROWS */}
                    {subItems.length > 0 &&
                      subItems.map((sub) => {
                        const selected = isSelectableGroup
                          ? formItems[index].selectedSubItems.find(
                              (s) => s.id === (sub.id || sub.itemId),
                            )
                          : null;

                        const checked = isSelectableGroup ? !!selected : true;

                        return (
                          <Fragment key={sub.id}>
                            <tr
                              key={`${sub.id}-name`}
                              className={`border-b border-slate-50 transition-all duration-200 ${
                                isAltGroup
                                  ? "bg-indigo-50/10 hover:bg-indigo-50/20"
                                  : "bg-white hover:bg-slate-50/50"
                              }`}
                            >
                              {(() => {
                                const hasDesc =
                                  sub.description &&
                                  sub.description
                                    .replace(/\s+/g, " ")
                                    .trim() !==
                                    (sub.name || "")
                                      .replace(/\s+/g, " ")
                                      .trim();
                                return (
                                  <td
                                    rowSpan={hasDesc ? 2 : 1}
                                    className="align-top border-b border-r border-slate-100/60 px-5 py-3 text-left"
                                  >
                                    <div className="flex min-h-[32px] items-start">
                                      <span
                                        className={`whitespace-nowrap font-mono text-[12px] font-bold ${
                                          checked || !isSelectableGroup
                                            ? "text-slate-700"
                                            : "text-slate-300"
                                        }`}
                                      >
                                        {sub.sku || ""}
                                      </span>
                                    </div>
                                  </td>
                                );
                              })()}
                              <td
                                className={`align-top border-b border-r border-slate-100/70 px-3 py-2 ${
                                  !checked && isSelectableGroup
                                    ? "opacity-40"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`text-[12px] font-medium leading-relaxed ${
                                    checked || !isSelectableGroup
                                      ? "text-slate-900"
                                      : "text-slate-300"
                                  }`}
                                >
                                  {sub.name || ""}
                                </div>
                              </td>
                              {row.category?.toLowerCase() ===
                              "test platform" ? (
                                <td
                                  colSpan={7}
                                  className="align-top border-b border-r border-slate-100/70 px-2 py-2 last:border-r-0"
                                ></td>
                              ) : (
                                <>
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                                    {(checked || !isSelectableGroup) && (
                                      <input
                                        type="number"
                                        min="1"
                                        value={
                                          Number.isFinite(
                                            Number(selected?.qty ?? sub.qty),
                                          )
                                            ? (selected?.qty ?? sub.qty)
                                            : 1
                                        }
                                        onChange={(e) =>
                                          updateSubItem(
                                            index,
                                            sub.id || sub.itemId,
                                            "qty",
                                            e.target.value,
                                          )
                                        }
                                        onBlur={() => autoSave(formItems)}
                                        className={`${inputBase} h-10 px-2 text-right tabular-nums`}
                                      />
                                    )}
                                  </td>
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                                    {(checked || !isSelectableGroup) && (
                                      <input
                                        type="text"
                                        readOnly={true}
                                        value={
                                          Number.isFinite(
                                            Number(
                                              selected?.price ?? sub.price,
                                            ),
                                          )
                                            ? formatAmount(
                                                selected?.price ?? sub.price,
                                              )
                                            : "0"
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value.replace(
                                            /,/g,
                                            "",
                                          );
                                          if (!isNaN(val) || val === "") {
                                            updateSubItem(
                                              index,
                                              sub.id || sub.itemId,
                                              "price",
                                              val,
                                            );
                                          }
                                        }}
                                        onBlur={() => autoSave(formItems)}
                                        className={`${inputBase} h-10 px-2 text-right tabular-nums cursor-not-allowed bg-slate-50/50`}
                                      />
                                    )}
                                  </td>
                                  {/* SUB-ITEM TOTAL PRICE */}
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                                    {(checked || !isSelectableGroup) && (
                                      <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
                                        {formatAmount(
                                          Number(
                                            (selected?.qty ?? sub.qty) || 1,
                                          ) *
                                            Number(
                                              (selected?.price ?? sub.price) ||
                                                0,
                                            ),
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                                    {(checked || !isSelectableGroup) && (
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={
                                            Number.isFinite(
                                              Number(
                                                selected?.discount ??
                                                  sub.discount,
                                              ),
                                            )
                                              ? (selected?.discount ??
                                                sub.discount)
                                              : 0
                                          }
                                          onChange={(e) =>
                                            updateSubItem(
                                              index,
                                              sub.id || sub.itemId,
                                              "discount",
                                              e.target.value,
                                            )
                                          }
                                          onBlur={() => autoSave(formItems)}
                                          className={`${inputBase} h-10 pl-2 pr-6 text-right tabular-nums text-rose-600`}
                                        />
                                        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-400/70">
                                          %
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-right">
                                    {(checked || !isSelectableGroup) && (
                                      <div className="flex h-10 items-center justify-end px-2 font-black tabular-nums text-[12px] text-slate-800">
                                        {formatAmount(
                                          Math.round(
                                            Number(
                                              (selected?.qty ?? sub.qty) || 1,
                                            ) *
                                              Number(
                                                (selected?.price ??
                                                  sub.price) ||
                                                  0,
                                              ) *
                                              (1 -
                                                Number(
                                                  (selected?.discount ??
                                                    sub.discount) ||
                                                    0,
                                                ) /
                                                  100),
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="align-top border-b border-r border-slate-100/70 px-1.5 py-2 text-left">
                                    {(checked || !isSelectableGroup) && (
                                      <textarea
                                        value={
                                          selected?.remarks ?? sub.remarks ?? ""
                                        }
                                        onChange={(e) =>
                                          updateSubItem(
                                            index,
                                            sub.id || sub.itemId,
                                            "remarks",
                                            e.target.value,
                                          )
                                        }
                                        onBlur={() => autoSave(formItems)}
                                        className="w-full min-h-[36px] border-0 bg-transparent p-1 text-[12px] text-slate-600 outline-none resize-none"
                                        placeholder="Note..."
                                      />
                                    )}
                                  </td>
                                  <td className="align-top border-b border-slate-100/70 px-2 py-2 text-center">
                                    {isSelectableGroup && (
                                      <button
                                        onClick={() =>
                                          toggleSubItem(index, sub)
                                        }
                                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200 ${
                                          checked
                                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        }`}
                                      >
                                        {checked ? (
                                          <BadgeCheck className="h-3.5 w-3.5" />
                                        ) : (
                                          <div className="h-2 w-2 rounded-full border-2 border-slate-300" />
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                            {sub.description &&
                              sub.description.replace(/\s+/g, " ").trim() !==
                                (sub.name || "")
                                  .replace(/\s+/g, " ")
                                  .trim() && (
                                <tr
                                  key={`${sub.id}-desc`}
                                  className={
                                    isAltGroup
                                      ? "bg-indigo-50/10 hover:bg-indigo-50/20"
                                      : "bg-white hover:bg-slate-50/50"
                                  }
                                >
                                  {/* SKU cell is handled by rowSpan above */}

                                  <td className="align-top border-r border-slate-100/70 px-3 pb-3">
                                    <div className="max-w-2xl whitespace-pre-wrap text-[12px] font-normal leading-relaxed text-slate-500">
                                      {sub.description}
                                    </div>
                                  </td>

                                  <td colSpan={7}></td>
                                </tr>
                              )}
                          </Fragment>
                        );
                      })}
                  </Fragment>
                );
              })}

              {/* TOTAL QUOTATION VALUE ROW */}
              {regularRows.length > 0 && (
                <tr className="bg-slate-100/30 font-bold border-t border-slate-200 text-[12px]">
                  <td
                    colSpan={2}
                    className="px-5 py-2.5 border-r border-slate-200/60"
                  ></td>
                  <td
                    colSpan={5}
                    className="px-5 py-2.5 text-left uppercase tracking-wider text-slate-500 text-[10px] border-r border-slate-200/60"
                  >
                    Total Quotation Value
                  </td>
                  <td className="px-5 py-2.5 text-right text-slate-700 font-black border-r border-slate-200/60">
                    {formatAmount(totalQuotationValue)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              )}

              {/* SUMMARY ROWS (P&F, I&C) */}
              {summaryRows.map(({ row, index }) => {
                const isPF = row.description === "P & F";
                const isIC = row.description === "I & C, Training";

                return (
                  <tr
                    key={`summary-${index}`}
                    className="bg-white/40 hover:bg-slate-50/50 transition-colors border-t border-slate-100/50"
                  >
                    <td className="px-5 py-2.5 border-r border-slate-200/60"></td>
                    <td className="px-5 py-2.5 border-r border-slate-200/60"></td>
                    <td className="px-5 py-2.5 text-left font-bold text-slate-600 border-r border-slate-200/60 text-[12px]">
                      {row.description}
                    </td>

                    {/* QTY */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
                      {!isPF && (
                        <input
                          type="number"
                          min="1"
                          value={
                            Number.isFinite(Number(row.qty)) ? row.qty : ""
                          }
                          onChange={(e) =>
                            updateItem(index, "qty", e.target.value)
                          }
                          onBlur={() => autoSave(formItems)}
                          className={`${inputBase} h-10 px-2 text-right tabular-nums`}
                        />
                      )}
                    </td>

                    {/* UNIT PRICE */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
                      <input
                        type="text"
                        value={
                          Number.isFinite(Number(row.price))
                            ? formatAmount(row.price)
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, "");
                          if (!isNaN(val) || val === "") {
                            updateItem(index, "price", val);
                          }
                        }}
                        onBlur={() => autoSave(formItems)}
                        className={`${inputBase} h-10 px-2 text-right tabular-nums`}
                      />
                    </td>

                    {/* SUMMARY TOTAL PRICE */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
                      <div className="flex h-10 items-center justify-end px-2 py-1 font-bold tabular-nums text-[12px] text-slate-600 bg-slate-50/30 rounded-lg">
                        {formatAmount(
                          Number(row.qty || 1) * Number(row.price || 0),
                        )}
                      </div>
                    </td>

                    {/* DISCOUNT */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right">
                      <div className="relative">
                        {!isPF && (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                Number.isFinite(Number(row.discount))
                                  ? row.discount
                                  : ""
                              }
                              onChange={(e) =>
                                updateItem(index, "discount", e.target.value)
                              }
                              onBlur={() => autoSave(formItems)}
                              className={`${inputBase} h-10 py-2 pl-2 pr-7 text-right tabular-nums text-rose-600`}
                            />
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-black text-rose-400/70">
                              %
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* FINAL PRICE */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-2 text-right font-black tabular-nums text-[12px] text-[#37306B]">
                      <div className="flex h-10 items-center justify-end px-2">
                        {formatAmount(
                          Math.round(
                            Number(row.qty || 1) *
                              Number(row.price || 0) *
                              (1 - Number(row.discount || 0) / 100),
                          ),
                        )}
                      </div>
                    </td>

                    {/* REMARKS */}
                    <td className="align-top border-r border-slate-200/60 px-1.5 py-1 text-left">
                      <textarea
                        rows={1}
                        value={row.remarks ?? ""}
                        onChange={(e) =>
                          updateItem(index, "remarks", e.target.value)
                        }
                        onBlur={() => autoSave(formItems)}
                        className="w-full resize-none border-0 bg-transparent p-2 text-[12px] leading-relaxed text-slate-700 outline-none overflow-hidden font-medium"
                        placeholder="Add internal notes…"
                      />
                    </td>

                    {/* DELETE */}
                    <td className="align-top px-2 py-1.5 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-400 shadow-sm transition-all duration-200 hover:border-rose-200 hover:from-rose-100 hover:to-rose-200/60 hover:text-rose-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* GRAND TOTAL ROW */}
              <tr className="bg-[#37306B]/5 font-black text-[#37306B] border-t-2 border-[#37306B]/10 text-[12px]">
                <td
                  colSpan={2}
                  className="px-5 py-3 border-r border-slate-200/60"
                ></td>
                <td
                  colSpan={5}
                  className="px-5 py-3 text-left uppercase tracking-[0.2em] text-[10px] border-r border-slate-200/60"
                >
                  Grand Total
                </td>
                <td className="px-5 py-3 text-right text-[13px] tracking-tight border-r border-slate-200/60">
                  {formatAmount(totals?.grandTotal || 0)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-100/80 bg-gradient-to-r from-slate-50/70 via-white/50 to-slate-50/30 px-3 py-2.5 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-2.5 text-[11px] text-slate-400">
          <span>All values update automatically as you edit the rows.</span>
          <span className="hidden sm:inline">
            Only selected sub-items are editable.
          </span>
        </div>
      </div>
    </div>
  );
}

function FragmentWrapper({ children }) {
  return <>{children}</>;
}
