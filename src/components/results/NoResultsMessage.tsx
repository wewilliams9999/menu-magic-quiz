
const NoResultsMessage = () => {
  return (
    <div className="text-center p-8 border border-zinc-800 rounded-lg bg-zinc-900/50">
      <p className="text-lg mb-4 text-zinc-200">No matches found for your preferences</p>
      <p className="text-zinc-400 mb-6">
        Try adjusting your preferences for more options, or check out our curated selection of local favorites.
      </p>
    </div>
  );
};

export default NoResultsMessage;
