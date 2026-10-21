import { count } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { teacherApps, teacherGroups } from '../database/schema'

/**
 * Seed the public teacher portal's PostgreSQL-backed card catalog.
 *
 * This is intentionally idempotent: once the catalog exists, edits made in the
 * Nuxt-Admin dashboard are preserved across restarts.
 */
export default defineNitroPlugin(async () => {
  const [groupCount] = await db.select({ value: count() }).from(teacherGroups)
  const groups = Number(groupCount?.value ?? 0) > 0
    ? await db.select({ id: teacherGroups.id, slug: teacherGroups.slug }).from(teacherGroups)
    : await db.insert(teacherGroups).values([
        {
          slug: 'get',
          titleEn: 'Get materials',
          titleZh: '取素材',
          noteEn: 'Paste a link, get the file back.',
          noteZh: '粘链接，把素材取回来。',
          sortOrder: 10
        },
        {
          slug: 'edit',
          titleEn: 'Edit media',
          titleZh: '处理素材',
          noteEn: 'Runs in your own browser — nothing is uploaded.',
          noteZh: '全部在你自己的浏览器里跑，不上传文件。',
          sortOrder: 20
        },
        {
          slug: 'prep',
          titleEn: 'Lesson prep & more',
          titleZh: '备课与其它',
          noteEn: 'Other tools for the classroom.',
          noteZh: '课堂里的其它工具。',
          sortOrder: 30
        }
      ]).returning({ id: teacherGroups.id, slug: teacherGroups.slug })

  const [appCount] = await db.select({ value: count() }).from(teacherApps)
  if (Number(appCount?.value ?? 0) > 0) return

  const bySlug = new Map(groups.map(group => [group.slug, group.id]))
  const groupId = (slug: string) => {
    const id = bySlug.get(slug)
    if (!id) throw new Error(`Teacher seed group not found: ${slug}`)
    return id
  }

  await db.insert(teacherApps).values([
    {
      slug: 'bili',
      groupId: groupId('get'),
      titleEn: 'Bilibili Downloader',
      titleZh: 'B站下载器',
      descEn: 'Paste a Bilibili link and get a full MP4 or an audio-only MP3. Files are private to your session and removed within an hour.',
      descZh: '粘贴 B站链接，取回完整 MP4 或只要音频 MP3。文件只对你自己可见，服务器 1 小时内自动删除。',
      href: '/bili/',
      icon: 'i-lucide-clapperboard',
      markEn: 'Server-side',
      markZh: '服务器端',
      sortOrder: 10
    },
    {
      slug: 'xhs',
      groupId: groupId('get'),
      titleEn: 'Xiaohongshu Downloader',
      titleZh: '小红书下载器',
      descEn: 'Paste a share link from the Xiaohongshu app and save original images or video without a watermark.',
      descZh: '把小红书 App 里的「分享 → 复制链接」粘进来，取回原图或原视频（无水印）。',
      href: '/xhs/',
      icon: 'i-lucide-book-image',
      markEn: 'Server-side',
      markZh: '服务器端',
      sortOrder: 20
    },
    {
      slug: 'music',
      groupId: groupId('get'),
      titleEn: 'Music Downloader',
      titleZh: '音乐下载器',
      descEn: 'Paste a song, playlist or album link — or type a song name — and get an MP3 back.',
      descZh: '粘歌曲、歌单或专辑链接，也可以直接输歌名，取回 MP3。',
      href: '/music/',
      icon: 'i-lucide-music-2',
      markEn: 'Server-side',
      markZh: '服务器端',
      sortOrder: 30
    },
    {
      slug: 'rotate',
      groupId: groupId('edit'),
      titleEn: 'Video Rotate',
      titleZh: '视频旋转',
      descEn: 'Turn a sideways clip the right way up. Runs in your browser — nothing is uploaded.',
      descZh: '把拍横或拍竖反了的视频转正。全在浏览器里跑，不上传任何东西。',
      href: '/media/rotate/',
      icon: 'i-lucide-rotate-cw',
      markEn: 'In-browser',
      markZh: '浏览器本地',
      sortOrder: 10
    },
    {
      slug: 'mute',
      groupId: groupId('edit'),
      titleEn: 'Remove Audio',
      titleZh: '去除音轨',
      descEn: 'Strip the soundtrack out of a clip — handy when you want to add your own narration.',
      descZh: '把视频里的声音去掉，方便配上你自己的讲解。',
      href: '/media/mute/',
      icon: 'i-lucide-volume-x',
      markEn: 'In-browser',
      markZh: '浏览器本地',
      sortOrder: 20
    },
    {
      slug: 'audio',
      groupId: groupId('edit'),
      titleEn: 'Extract Audio',
      titleZh: '提取音频',
      descEn: 'Pull the audio track out of a video as an MP3.',
      descZh: '把视频里的音频提取成 MP3。',
      href: '/media/audio/',
      icon: 'i-lucide-audio-lines',
      markEn: 'In-browser',
      markZh: '浏览器本地',
      sortOrder: 30
    },
    {
      slug: 'compress',
      groupId: groupId('edit'),
      titleEn: 'Compress Video',
      titleZh: '视频压缩',
      descEn: 'Shrink a big clip so it uploads, plays or emails easily.',
      descZh: '把大视频压小，方便上传、播放或发送。',
      href: '/media/compress/',
      icon: 'i-lucide-minimize-2',
      markEn: 'In-browser',
      markZh: '浏览器本地',
      sortOrder: 40
    },
    {
      slug: 'mosaic',
      groupId: groupId('edit'),
      titleEn: 'Video Mosaic',
      titleZh: '视频打码',
      descEn: 'Blur a face, a name tag or a watermark before a clip goes into a slide.',
      descZh: '给视频里的人脸、胸牌或水印打码，再放进课件。',
      href: '/media/mosaic/',
      icon: 'i-lucide-scan-face',
      markEn: 'In-browser',
      markZh: '浏览器本地',
      sortOrder: 50
    },
    {
      slug: 'chalkline',
      groupId: groupId('prep'),
      titleEn: 'Chalkline',
      titleZh: 'Chalkline 练习题生成',
      descEn: 'Drop in a PDF or Word file and get a printable practice sheet with an answer key.',
      descZh: '课件进、练习出：丢一个 PDF 或 Word 进去，出来一份可打印的练习题，附答案。',
      href: 'https://chalkline.yunshuling.com/',
      icon: 'i-lucide-pencil-line',
      markEn: 'Web app',
      markZh: '网页应用',
      external: true,
      sortOrder: 10
    },
    {
      slug: 'face',
      groupId: groupId('prep'),
      titleEn: 'Staff Face Enrollment',
      titleZh: '员工人脸采集',
      descEn: 'Staff fill in their details, take a guided selfie, and admins export photos plus CSV for the face terminal.',
      descZh: '员工填写信息、按引导拍照；管理员统一导出照片目录和 CSV，导入人脸门禁。',
      href: '/face/',
      icon: 'i-lucide-id-card',
      markEn: 'Server-side · Staff',
      markZh: '服务器端 · 员工自助',
      pinned: true,
      sortOrder: 20
    },
    {
      slug: 'soon',
      groupId: groupId('prep'),
      titleEn: 'More tools on the way',
      titleZh: '更多工具在路上',
      descEn: 'Tell us which job eats your evenings and it may end up here.',
      descZh: '告诉我们最耗时间的活儿，它可能就出现在这里。',
      href: '',
      icon: 'i-lucide-sparkles',
      markEn: 'Coming soon',
      markZh: '开发中',
      status: 'soon',
      sortOrder: 30
    }
  ])

  console.log('[teacher] Seeded PostgreSQL-backed tool cards')
})
