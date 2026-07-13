interface Props {
    search: string;
    setSearch: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
  }
  
  const ReportsFilter = ({
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
  }: Props) => {
    return (
      <div className="flex flex-col md:flex-row gap-4">
  
        <input
          type="text"
          placeholder="Search title, tracking ID or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
  
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="assigned">Assigned</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
  
      </div>
    );
  };
  
  export default ReportsFilter;