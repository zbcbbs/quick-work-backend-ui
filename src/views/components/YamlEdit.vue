<template>
  <div class="app-container">
    <p class="warn-content">
      Yaml编辑器
    </p>
    <Yaml :value="value" :height="height" />
  </div>
</template>

<script>
import Yaml from '@/components/YamlEdit/index'
export default {
  name: 'YamlEdit',
  components: { Yaml },
  data() {
    return {
      height: document.documentElement.clientHeight - 210 + 'px',
      value: '# 展示数据，若需更换主题，请在src/components/YamlEdit 目录中搜索主题名称进行替换\n' +
        '\n' +
        '# ===================================================================\n' +
        '# Spring Boot configuration.\n' +
        '\n' +
        'eureka:\n' +
        '    client:\n' +
        '        enabled: true\n' +
        '        healthcheck:\n' +
        '            enabled: true\n' +
        '        fetch-registry: true\n' +
        '        register-with-eureka: true\n' +
        '        instance-info-replication-interval-seconds: 10\n' +
        '        registry-fetch-interval-seconds: 10\n' +
        '    instance:\n' +
        '        appname: product\n' +
        '        instanceId: product:${spring.application.instance-id:${random.value}}\n' +
        '        #instanceId: 127.0.0.1:9099\n' +
        '        lease-renewal-interval-in-seconds: 5\n' +
        '        lease-expiration-duration-in-seconds: 10\n' +
        '        status-page-url-path: ${management.endpoints.web.base-path}/info\n' +
        '        health-check-url-path: ${management.endpoints.web.base-path}/health\n' +
        '        metadata-map:\n' +
        '            zone: primary # This is needed for the load balancer\n' +
        '            profile: ${spring.profiles.active}\n' +
        '            version: ${info.project.version:}\n' +
        '            git-version: ${git.commit.id.describe:}\n' +
        '            git-commit: ${git.commit.id.abbrev:}\n' +
        '            git-branch: ${git.branch:}\n' +
        'ribbon:\n' +
        '    ReadTimeout: 120000\n' +
        '    ConnectTimeout: 300000\n' +
        '    eureka:\n' +
        '        enabled: true\n' +
        '\n'
    }
  },
  mounted() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 210 + 'px'
    }
  }
}
</script>

<style scoped>

</style>
