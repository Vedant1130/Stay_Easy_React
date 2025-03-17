from jet.dashboard.dashboard import Dashboard
from jet.dashboard.modules import DashboardModule, LinkList, AppList, ModelList, Feed

class CustomIndexDashboard(Dashboard):
    columns = 3

    def init_with_context(self, context):
        pass 
        # self.children.append(AppList(
        #     title="Applications",
        #     models=('myapp.models.*',)
        # ))

        # self.children.append(ModelList(
        #     title="Authentication and Authorization",
        #     models=('django.contrib.auth.*',)
        # ))

        # self.children.append(Feed(
        #     title="Latest Django News",
        #     feed_url="https://www.djangoproject.com/rss/weblog/",
        #     limit=5
        # ))
