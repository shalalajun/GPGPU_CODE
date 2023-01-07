

// uniform sampler2D textureVelocity;



void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;
    
  vec3 acc = vec3(0.00, -0.01, 0.0);

    vel = vel + acc;
    //vel.y -= 0.001;

    pos += vel;
   if(pos.y <= -2.0)
     {
        pos.y = -2.0;
        vel.y *= -0.9;
         vel.xz *= 0.98;
     }

    gl_FragColor = vec4( vel, 1.0 );

}