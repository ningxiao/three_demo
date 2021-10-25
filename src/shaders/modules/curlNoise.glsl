#pragma glslify:snoise=require(glsl-noise/simplex/3d)

vec3 snoiseVec3(vec3 x) {
    return vec3(snoise(vec3(x) * 2. - 1.), snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)) * 2. - 1., snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4) * 2. - 1.));
}

vec3 curlNoise(vec3 p) {
    const float e = .1;
    vec3 dx = vec3(e, 0., 0.);
    vec3 dy = vec3(0., e, 0.);
    vec3 dz = vec3(0., 0., e);

    vec3 p_x0 = snoiseVec3(p - dx);
    vec3 p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy);
    vec3 p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz);
    vec3 p_z1 = snoiseVec3(p + dz);

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float divisor = 1. / (2. * e);
    return normalize(vec3(x, y, z) * divisor);
}

#pragma glslify:export(curlNoise)
