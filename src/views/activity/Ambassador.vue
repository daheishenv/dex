<template>
	<section class="page">
		<article class="AmbassadorImg">
			<div class="imgbox" v-if="$store.state.app.language === 'zh-CN'">
				<img src="https://nds.340wan.com/static/img/activity/influencer/ambassadorzh-cn.png" alt="">
			</div>
			<div class="imgbox" v-else-if="$store.state.app.language === 'zh-TW'">
				<img src="https://nds.340wan.com/static/img/activity/influencer/ambassadorzh-tw.png" alt="">
			</div>
			<div class="imgbox" v-else>
				<img src="https://nds.340wan.com/static/img/activity/influencer/ambassador-en.png" alt="">
			</div>
			<p>{{$t('ambassador.title')}}</p>
		</article>
		<article class="mp4">
			<video class="mp4-item" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
				preload="auto" poster="https://nds.340wan.com/static/img/activity/influencer/video.png" controls="controls">
				<source src="https://newdex.oss-cn-hangzhou.aliyuncs.com/ambassador.mp4" type="video/mp4">
			</video>
			<!-- <video v-else class="mp4-item" src="https://www.youtube.com/embed/vWukx3mNKn4"
				preload="auto" poster="https://nds.340wan.com/static/img/activity/influencer/video.png" controls="controls">
			</video> -->
			<div v-else class="mp4-item">
				<!-- <img class="img" src="https://nds.340wan.com/static/img/activity/influencer/video.png"> -->
				<iframe class="mp4-item" src="https://www.youtube.com/embed/vWukx3mNKn4" frameborder="0"></iframe>
			</div>
		</article>
		<article class="info">
			<div class="title">{{$t('ambassador.listTitle')}}</div>
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name1')}}</h4>
				<p class="nation">{{$t('ambassador.nation1')}}</p>
				<div class="desc">{{$t('ambassador.desc1')}}</div>
			</div>
			<!-- <div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name2')}}</h4>
				<p class="nation">{{$t('ambassador.nation2')}}</p>
				<div class="desc">{{$t('ambassador.desc2')}}</div>
			</div> -->
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name3')}}</h4>
				<p class="nation">{{$t('ambassador.nation3')}}</p>
				<div class="desc">{{$t('ambassador.desc3')}}</div>
			</div>
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name4')}}</h4>
				<p class="nation">{{$t('ambassador.nation4')}}</p>
				<div class="desc">{{$t('ambassador.desc4')}}</div>
			</div>
			<!-- <div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name5')}}</h4>
				<p class="nation">{{$t('ambassador.nation5')}}</p>
				<div class="desc">{{$t('ambassador.desc5')}}</div>
			</div> -->
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name6')}}</h4>
				<p class="nation">{{$t('ambassador.nation6')}}</p>
				<div class="desc">{{$t('ambassador.desc6')}}</div>
			</div>
			<!-- <div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name7')}}</h4>
				<p class="nation">{{$t('ambassador.nation7')}}</p>
				<div class="desc">{{$t('ambassador.desc7')}}</div>
			</div> -->
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name9')}}</h4>
				<p class="nation">{{$t('ambassador.nation9')}}</p>
				<div class="desc">{{$t('ambassador.desc9')}}</div>
			</div>
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name10')}}</h4>
				<p class="nation">{{$t('ambassador.nation10')}}</p>
				<div class="desc">{{$t('ambassador.desc10')}}</div>
			</div>
				<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name11')}}</h4>
				<p class="nation">{{$t('ambassador.nation11')}}</p>
				<div class="desc">{{$t('ambassador.desc11')}}</div>
			</div>
				<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name12')}}</h4>
				<p class="nation">{{$t('ambassador.nation12')}}</p>
				<div class="desc">{{$t('ambassador.desc12')}}</div>
			</div>
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name13')}}</h4>
				<p class="nation">{{$t('ambassador.nation13')}}</p>
				<div class="desc">{{$t('ambassador.desc13')}}</div>
			</div>
			<div class="ambassador-item">
				<h4 class="name">{{$t('ambassador.name14')}}</h4>
				<p class="nation">{{$t('ambassador.nation14')}}</p>
				<div class="desc">{{$t('ambassador.desc14')}}</div>
			</div>

		</article>
		<footer>
			{{$t('ambassador.footerdesc')}}
		</footer>
	</section>
</template>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		width: 100%;
		background-color: #0A0A0A;
		display: flex;
		flex-direction: column;

		.AmbassadorImg {
			height: 5.2rem;
			width: 100%;
			background: url('https://nds.340wan.com/static/img/activity/influencer/ambassadorbg.png');
			.imgbox {
				width: 6.72rem;
				height: 2.75rem;
				margin: 0.6rem auto 0.3rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			p {
				width: 100%;
				box-sizing: border-box;
				padding: 0 0.5rem;
				text-align: center;
				color: #fccaa4;
				font-size: 0.24rem;
			}
		}

		.mp4 {
			display: flex;
			justify-content: center;
			padding: 0 0.3rem;
			height: 4rem;
			width: 100%;
			box-sizing: border-box;
			margin: .5rem 0 .1rem 0;
			.mp4-item{
				width: 100%;
				height: 100%;
				position: relative;
			}
			.img{
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: 100;
			}
		}

		.info {
			.title {
				line-height: 2rem;
				font-size: 0.36rem;
				color: #fccaa4;
				text-align: center;
			}

			.ambassador-item {
				width: 6.9rem;
				background: #564D46;
				display: flex;
				flex-direction: column;
				margin: 0 auto .55rem;
				padding: 0.7rem 0.55rem;
				box-sizing: border-box;
				font-size: .3rem;
				color: #fff;
				text-align: center;
				.name {
					font-size: .36rem;
				}
				.nation {
					line-height: .6rem;
					font-size: .28rem;
					color: #bcbcbc;
				}
				.desc {
					line-height: .5rem;
				}
			}
		}
		footer {
			width: 100%;
			padding: .2rem .7rem 1.4rem;
			box-sizing: border-box;
			color: #C4A68F;
			text-align: center;
			font-size: .3rem;
			line-height: .4rem;
		}
	}
</style>
