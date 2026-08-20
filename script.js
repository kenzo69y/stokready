const $=x=>document.getElementById(x);
const money=n=>new Intl.NumberFormat("km-KH",{style:"currency",currency:"KHR",maximumFractionDigits:0}).format(Number(n)||0);

// SUPABASE KASIR TOKO
const SUPABASE_URL='https://hbewkflvocskgiypgjft.supabase.co';
const SUPABASE_KEY='sb_publishable_6oQ0xG2TskM37fjf3mv_7A_9WX2dG-X';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

// GANTI DENGAN USERNAME TELEGRAM TOKO TANPA @
const TELEGRAM_USERNAME="Xxesohee";

let products=[],cart=[],cat="Semua",loading=true;

function iconFor(name){
  const n=String(name||'').toLowerCase();
  if(n.includes('mie')||n.includes('noodle')) return '🍜';
  if(n.includes('aqua')||n.includes('air')) return '💧';
  if(n.includes('teh')) return '🥤';
  if(n.includes('kopi')) return '☕';
  if(n.includes('biskuit')||n.includes('roti')) return '🍪';
  if(n.includes('sabun')) return '🧼';
  if(n.includes('shampoo')||n.includes('sampo')) return '🧴';
  if(n.includes('rokok')||n.includes('surya')) return '📦';
  return '🛍️';
}

function imageFileFor(code){
  const safe=String(code||'').trim().replace(/[^a-zA-Z0-9_-]/g,'');
  return safe ? `images/${safe}.jpg` : '';
}

function productVisual(p){
  const src=imageFileFor(p.code);
  if(!src) return `<span class="fallback-icon">${p.i}</span>`;
  return `<img class="product-photo" src="${src}" alt="${p.n}" style="width:100%;height:100%;object-fit:contain;object-position:center;padding:10px;box-sizing:border-box;display:block;"
    onerror="
      if(this.dataset.try==='png'){this.dataset.try='webp';this.src='images/${String(p.code||'').trim().replace(/[^a-zA-Z0-9_-]/g,'')}.webp'}
      else if(this.dataset.try==='webp'){this.style.display='none';this.nextElementSibling.style.display='grid'}
      else{this.dataset.try='png';this.src='images/${String(p.code||'').trim().replace(/[^a-zA-Z0-9_-]/g,'')}.png'}
    ">
    <span class="fallback-icon" style="display:none">${p.i}</span>`;
}

function categoryFor(name){
  const n=String(name||'').toLowerCase();
  if(n.includes('mie')||n.includes('biskuit')||n.includes('roti')||n.includes('snack')) return 'Makanan';
  if(n.includes('aqua')||n.includes('air')||n.includes('teh')||n.includes('kopi')||n.includes('minum')) return 'Minuman';
  if(n.includes('sabun')||n.includes('shampoo')||n.includes('sampo')||n.includes('pasta')||n.includes('deterjen')) return 'Kebutuhan';
  if(n.includes('rokok')||n.includes('surya')) return 'Rokok';
  return 'Lainnya';
}

async function loadProducts(){
  loading=true;
  $("grid").innerHTML='<div class="empty">Mengambil stok terbaru dari Kasir Toko...</div>';
  const {data,error}=await db.from('products')
    .select('id,code,name,sell_price,stock,created_at')
    .order('created_at',{ascending:false});
  if(error){console.error(error);$("grid").innerHTML=`<div class="empty">Gagal mengambil produk online.<br><small>${error.message}</small></div>`;loading=false;return;}
  products=(data||[]).map(p=>({id:Number(p.id),n:p.name,p:Number(p.sell_price||0),s:Number(p.stock||0),code:p.code||'',c:categoryFor(p.name),i:iconFor(p.name),createdAt:p.created_at||null}));
  loading=false;cats();render();syncCartWithStock();
}

function isNewProduct(createdAt){
  if(!createdAt)return false;
  const created=new Date(createdAt);if(Number.isNaN(created.getTime()))return false;
  const ageMs=Date.now()-created.getTime();const sevenDays=7*24*60*60*1000;
  return ageMs>=0&&ageMs<=sevenDays;
}

function cats(){let a=["Semua",...new Set(products.map(x=>x.c))];$("cats").innerHTML=a.map(x=>`<button class="${x==cat?"active":""}" onclick="setCat('${x}')">${x}</button>`).join("");}
function setCat(x){cat=x;cats();render()}
function render(){let q=$("search").value.toLowerCase().trim();let a=products.filter(x=>(cat=="Semua"||x.c==cat)&&(x.n.toLowerCase().includes(q)||x.code.toLowerCase().includes(q)));$("grid").innerHTML=a.length?a.map(x=>`<div class="product"><div class="pic">${productVisual(x)}</div><div class="info"><small>${x.c} • ${x.code||'-'} • Stok ${x.s}</small><h3>${x.n}</h3><div class="row"><div class="price-box"><b>${money(x.p)}</b>${isNewProduct(x.createdAt)?'<span class="new-under-price">NEW</span>':''}</div><button onclick="add(${x.id})" ${x.s<=0?'disabled title="Stok habis"':''}>${x.s<=0?'×':'+'}</button></div></div></div>`).join(""):'<div class="empty">Produk tidak ditemukan.</div>';}
function add(id){let p=products.find(x=>x.id==id);if(!p||p.s<=0)return alert("Stok barang sedang habis.");let c=cart.find(x=>x.id==id);if(c){if(c.q>=p.s)return alert("Jumlah sudah mencapai stok tersedia.");c.q++;}else cart.push({...p,q:1});rc();}
function qty(id,d){let c=cart.find(x=>x.id==id),p=products.find(x=>x.id==id);if(!c||!p)return;if(d>0&&c.q>=p.s)return alert("Jumlah sudah mencapai stok terbaru.");c.q+=d;if(c.q<=0)cart=cart.filter(x=>x.id!=id);rc();}
function syncCartWithStock(){cart=cart.filter(c=>{const p=products.find(x=>x.id===c.id);if(!p||p.s<=0)return false;c.p=p.p;c.s=p.s;c.n=p.n;c.code=p.code;if(c.q>p.s)c.q=p.s;return true;});rc();}
function sum(){return cart.reduce((a,x)=>a+x.p*x.q,0)}
function rc(){$("count").innerText=$("fcount").innerText=cart.reduce((a,x)=>a+x.q,0);$("total").innerText=$("ftotal").innerText=money(sum());$("cart").innerHTML=cart.length?cart.map(x=>`<div class="item"><div><b>${x.n}</b><br><small>${money(x.p)} × ${x.q}</small></div><div class="qty"><button onclick="qty(${x.id},-1)">−</button><b>${x.q}</b><button onclick="qty(${x.id},1)">+</button></div></div>`).join(""):"Keranjang masih kosong.";}
function openCart(){$("overlay").classList.remove("hide")}
function closeCart(){$("overlay").classList.add("hide")}
$("search").oninput=render;
$("send").onclick=async()=>{if(!cart.length)return alert("Keranjang kosong");await loadProducts();if(!cart.length)return alert("Barang di keranjang sudah tidak tersedia.");for(const c of cart){const p=products.find(x=>x.id===c.id);if(!p||c.q>p.s)return alert(`Stok ${c.n} berubah. Silakan periksa keranjang lagi.`);}let n=$("name").value.trim(),note=$("note").value.trim();if(!n)return alert("Masukkan nama pemesan");if(TELEGRAM_USERNAME=="GANTI_USERNAME_TELEGRAM")return alert("Ganti username Telegram di script.js");let items=cart.map((x,i)=>`${i+1}. ${x.n} x${x.q} = ${money(x.p*x.q)}`).join("\n");let text=`🛍️ PESANAN BARU\n\n${items}\n\n💰 TOTAL: ${money(sum())}\n\n👤 Nama: ${n}\n📝 Catatan: ${note||"-"}`;window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`,"_blank");};
setInterval(()=>{if(!document.hidden)loadProducts()},15000);
rc();loadProducts();