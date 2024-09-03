import { Link } from '@umijs/max';

export function itemRender(route, params, routes) {
	const last = routes.indexOf(route) === routes.length - 1;
	return last ? (
		<span>{route.breadcrumbName}</span>
	) : (
		<Link to={route.path}>{route.breadcrumbName}</Link>
	);
}
