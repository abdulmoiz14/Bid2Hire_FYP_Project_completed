// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const proNavConfig = [
    {
      title: 'Bidding',
      path: '/dashboard-labor/app',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Flat',
      path: '/dashboard-labor/flatLabor',
      icon: icon('ic_cart'),
    },
    {
      title: 'Ongoing Jobs',
      path: '/dashboard-labor/ongoingJobs',
      icon: icon('ic_user'),
    },
    {
      title: 'History',
      path: '/dashboard-labor/blog',
      icon: icon('ic_blog'),
    },
  ];
  
  export default proNavConfig;
  