// 获取计算以后CSS样式的方法
function getStyle( obj , attr ){
    if( window.getComputedStyle ){
        return window.getComputedStyle( obj, null )[attr];
    }else{
        return obj.currentStyle[attr];
    }
}

// 封装缓慢动画函数
/* 
    obj 需要做动画的dom对象
    json 是一个自定义对象
    callback 回调函数,可选参数
*/
function animate( obj, json , callback ){
    // 清除之前定时器
    window.clearInterval( obj.timer );
    // 开启新的定时器
    obj.timer = window.setInterval( function(){
        // 在定时器里面定义一个flag变量,表示是否所有属性达到目标值
        var flag = true;// 假设所有属性都达到了目标值

        // 遍历自定义对象,使用for...in
        for( var attr in  json ){
            if( attr == "opacity" ){// 如果有透明度属性,需要单独处理
                /* opacity的取值是0~1之间的小数,没有px单位,包括0和1 0代表完全透明,1代表完全不透明 默认取值1*/

                // 获取当前属性名对应的当前值
                var currentVal = getStyle( obj,  attr ) * 100 ;

                // 计算步骤  公式  (目标值-当前值) / 10;
                var speed = ( json[attr]*100 - currentVal) / 10;

                // 判断speed是否大于0 大于0向上取整 小于0向下取整
                speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );

                // opactiy是不需要带px单位,并且是0~1
                obj.style[attr] = (currentVal + speed) / 100 ;

                if( currentVal != json[attr]*100 ){// 如果当前属性值达不到目标值,flag改为false
                    flag = false;
                }

            }else if( attr == "zIndex"){// zIndex也需要单独处理
                /* z-index层级属性 取值数值,不带px单位 */
                // z-index不需要缓动动画,直接设置即可
                obj.style[attr] = json[attr];
            }else{
                // 获取当前属性名对应的当前值
                var currentVal = parseInt( getStyle( obj,  attr ) ) ;
                // 计算步骤  公式  (目标值-当前值) / 10;
                var speed = ( json[attr] - currentVal) / 10
                // 判断speed是否大于0 大于0向上取整 小于0向下取整
                speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
                // 设置obj对象的对应css属性样式
                obj.style[attr] = currentVal + speed + "px";

                if( currentVal != json[attr] ){// 如果当前属性值达不到目标值,flag改为false
                    flag = false;
                }
            }
            
        }

        // 多个属性的时候,只要有一个属性值达到目标值,就会清除定时器,容易导致其他属性值达不到目标值
        // 解决方法:使用一个变量,表示当前是否所有属性都到达了目标值
        if( flag ){// 如果此时for...in已经遍历完成,flag的值还是true,表示所有属性达到目标值
            // 清除定时器
            window.clearInterval( obj.timer );
            // 所有属性的动画完成以后,执行回调函数
            if( callback ){
                callback();
            }
        }


        
    }, 15 );
}