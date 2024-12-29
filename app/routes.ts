import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes'

const routes = [
  index('./routes/homepage.tsx'),
  route('/tracker', './routes/tracker/route.tsx'),
  route('/ingread', './routes/ingread/route.tsx'),
  route('/tracker-journal', './routes/tracker-journal/route.tsx'),
  route('/tracker-regimen', './routes/tracker-regimen/route.tsx'),
  route('/trends', './routes/trends.tsx'),
  route('/fridai', './routes/fridai+/_fridai.tsx'),
  route('/resource/locales', './routes/resource.locales.tsx'),
  route('/fungcaster', './routes/fungcaster/route.tsx'),
  ...prefix('/blog', [
    layout('./routes/blog+/_layout.tsx', [
      index('./routes/blog+/index.tsx'),
      ...prefix('/posts', [route('/food-guide', './routes/blog+/posts+/food-guide/route.tsx')]),
    ]),
  ]),
  ...prefix('/privacy', [index('./routes/privacy+/index.tsx'), route('/policy', './routes/privacy+/policy.tsx')]),
  layout('./routes/memery+/_layout.tsx', [route('/memery/platos-cave', './routes/memery+/platos-cave/route.tsx')]),
  route('/image-generator', './routes/image-generator/route.tsx'),
] satisfies RouteConfig
export default routes
