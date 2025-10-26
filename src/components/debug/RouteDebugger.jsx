import { useLocation } from 'react-router-dom';

const RouteDebugger = () => {
  const location = useLocation();
  
  console.log('Current path:', location.pathname);
  console.log('Current search:', location.search);
  console.log('Current hash:', location.hash);
  
  return null;
};

export default RouteDebugger;