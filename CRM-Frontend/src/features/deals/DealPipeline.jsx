import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDeals } from "./dealSlice";
import { PIPELINE_STAGES, formatCurrency, formatDate } from "../../constants";
import PageHeader from "../../components/PageHeader";
import Spinner from "../../components/Spinner";

const DealPipeline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deals, loading } = useSelector((s) => s.deals);

  useEffect(() => { dispatch(fetchDeals({ limit: 200 })); }, [dispatch]);

  const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.key] = deals.filter((d) => d.stage === stage.key);
    return acc;
  }, {});

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <PageHeader title="Lead Pipeline" subtitle={`${deals.length} total leads`}>
        <button onClick={() => navigate("/deals")} className="btn-secondary">List View</button>
        <button onClick={() => navigate("/deals/new")} className="btn-primary">+ New Lead</button>
      </PageHeader>

      <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: "70vh" }}>
        {PIPELINE_STAGES.map((stage) => {
          const stageDeals = grouped[stage.key] || [];
          const total = stageDeals.reduce((s, d) => s + (d.amount || 0), 0);

          return (
            <div key={stage.key} className="flex-shrink-0 w-72">
              <div className={`rounded-t-xl border-t-4 ${stage.color} bg-white shadow-sm rounded-b-xl`}>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-900">{stage.label}</h3>
                    <span className="badge-gray text-[10px]">{stageDeals.length}</span>
                  </div>
                  {total > 0 && <p className="text-xs text-gray-500 mt-1">{formatCurrency(total)}</p>}
                </div>
                <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                  {stageDeals.length === 0 ? (
                    <p className="text-center text-gray-300 text-xs py-10">No leads</p>
                  ) : stageDeals.map((deal) => (
                    <div key={deal.id} onClick={() => navigate(`/deals/${deal.id}`)}
                      className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all border border-gray-100">
                      <p className="font-medium text-sm text-gray-900 truncate">{deal.dealName}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{deal.account?.accountName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-gray-700">{formatCurrency(deal.amount)}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(deal.closingDate)}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{deal.owner?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealPipeline;