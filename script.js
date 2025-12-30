// script.js - GeoJSON Map Editor with FontAwesome marker icons

// ==== Configuration ==== //
const AMAP_API_KEY = 'f9ef1f8a897389df48a43e18ac4660d8';
const AMAP_GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/geo';

// ==== Initialize Map ==== //
const map = L.map('map').setView([36.0671, 120.3826], 12); // 青岛市中心

// Base layers - expanded map options
const baseLayers = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 19,
    }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
    }),
    light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
    }),
    terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap',
        maxZoom: 17,
    }),
    stamen: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; Stamen Design',
        maxZoom: 20,
    }),
    carto: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
    }),
};
baseLayers.osm.addTo(map);


// ==== FontAwesome Icon Marker System ==== //
// Extended marker icons configuration - 30+ icons
const MARKER_ICONS = {
    'default': { class: 'fa-solid fa-location-dot', label: '定位点' },
    'car': { class: 'fa-solid fa-car', label: '汽车' },
    'shop': { class: 'fa-solid fa-bag-shopping', label: '商店' },
    'fuel': { class: 'fa-solid fa-gas-pump', label: '加油站' },
    'warehouse': { class: 'fa-solid fa-warehouse', label: '仓库' },
    'home': { class: 'fa-solid fa-house', label: '房屋' },
    'building': { class: 'fa-solid fa-building', label: '建筑' },
    'hospital': { class: 'fa-solid fa-hospital', label: '医院' },
    'school': { class: 'fa-solid fa-school', label: '学校' },
    'restaurant': { class: 'fa-solid fa-utensils', label: '餐厅' },
    'coffee': { class: 'fa-solid fa-mug-hot', label: '咖啡' },
    'hotel': { class: 'fa-solid fa-hotel', label: '酒店' },
    'parking': { class: 'fa-solid fa-square-parking', label: '停车场' },
    'bank': { class: 'fa-solid fa-landmark', label: '银行' },
    'gym': { class: 'fa-solid fa-dumbbell', label: '健身房' },
    'park': { class: 'fa-solid fa-tree', label: '公园' },
    'beach': { class: 'fa-solid fa-umbrella-beach', label: '海滩' },
    'mountain': { class: 'fa-solid fa-mountain', label: '山峰' },
    'airport': { class: 'fa-solid fa-plane', label: '机场' },
    'train': { class: 'fa-solid fa-train', label: '火车站' },
    'bus': { class: 'fa-solid fa-bus', label: '公交站' },
    'ship': { class: 'fa-solid fa-ship', label: '港口' },
    'factory': { class: 'fa-solid fa-industry', label: '工厂' },
    'office': { class: 'fa-solid fa-briefcase', label: '办公室' },
    'church': { class: 'fa-solid fa-church', label: '教堂' },
    'museum': { class: 'fa-solid fa-landmark-dome', label: '博物馆' },
    'library': { class: 'fa-solid fa-book', label: '图书馆' },
    'pharmacy': { class: 'fa-solid fa-prescription-bottle-medical', label: '药店' },
    'police': { class: 'fa-solid fa-shield-halved', label: '警察局' },
    'fire': { class: 'fa-solid fa-fire-extinguisher', label: '消防站' },
    'star': { class: 'fa-solid fa-star', label: '收藏' },
    'heart': { class: 'fa-solid fa-heart', label: '喜爱' },
    'flag': { class: 'fa-solid fa-flag', label: '旗帜' },
    'pin': { class: 'fa-solid fa-thumbtack', label: '图钉' },
    'warning': { class: 'fa-solid fa-triangle-exclamation', label: '警告' },
    'info': { class: 'fa-solid fa-circle-info', label: '信息' },
};

// Extended marker colors configuration - 12 colors
const MARKER_COLORS = {
    'blue': { hex: '#4a90e2', label: '蓝色' },
    'red': { hex: '#e24a4a', label: '红色' },
    'green': { hex: '#4ae24a', label: '绿色' },
    'orange': { hex: '#e2a04a', label: '橙色' },
    'purple': { hex: '#9b4ae2', label: '紫色' },
    'pink': { hex: '#e24a9b', label: '粉色' },
    'teal': { hex: '#4ae2e2', label: '青色' },
    'yellow': { hex: '#e2e24a', label: '黄色' },
    'gray': { hex: '#6b6b6b', label: '灰色' },
    'brown': { hex: '#8b4513', label: '棕色' },
    'navy': { hex: '#2c3e50', label: '深蓝' },
    'lime': { hex: '#32cd32', label: '酸橙绿' },
};

// Legacy iconClassMap for backward compatibility
const iconClassMap = {};
Object.keys(MARKER_ICONS).forEach(key => {
    iconClassMap[key] = MARKER_ICONS[key].class;
});


// Create custom marker icon with FontAwesome
function createCustomMarkerIcon(color, symbol) {
    // Default to blue if color not provided or invalid
    if (!color || color.indexOf('#') !== 0) {
        color = '#4a90e2'; // default blue
    }

    // Get FontAwesome icon class
    const iconClass = iconClassMap[symbol] || iconClassMap['default'];

    // Create HTML with circular background and FontAwesome icon
    // Create HTML with circular background and FontAwesome icon
    const html = `
        <div class="custom-marker-wrapper">
            <div class="custom-marker-circle" style="background-color: ${color};">
                <i class="${iconClass}"></i>
            </div>
            <div class="custom-marker-tip" style="border-top-color: ${color};"></div>
        </div>
    `;

    return L.divIcon({
        html: html,
        className: 'custom-marker-icon',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
    });
}

// Determine icon based on feature properties
function getMarkerIcon(properties) {
    let color = '#4a90e2'; // default blue
    let symbol = 'default';

    if (properties) {
        // Read marker-color (hex color like #00AA00)
        if (properties['marker-color']) {
            color = properties['marker-color'];
            // If it's a named color, convert to hex
            if (color.indexOf('#') !== 0) {
                const colorMap = {
                    'blue': '#4a90e2',
                    'red': '#e74c3c',
                    'green': '#2ecc71',
                    'orange': '#f39c12',
                    'yellow': '#f1c40f',
                    'violet': '#9b59b6',
                    'purple': '#800080',
                    'grey': '#95a5a6',
                    'black': '#2c3e50'
                };
                color = colorMap[color.toLowerCase()] || '#4a90e2';
            }
        }

        // Read marker-symbol or type
        if (properties['marker-symbol']) {
            symbol = properties['marker-symbol'];
        } else if (properties.type) {
            const type = properties.type.toLowerCase();
            const symbolMap = {
                'shop': 'shop',
                'store': 'shop',
                '商店': 'shop',
                '快准服务站': 'shop',
                'warehouse': 'warehouse',
                'building': 'warehouse',
                '仓库': 'warehouse',
                '新康众服务站': 'warehouse',
                'fuel': 'fuel',
                'gas_station': 'fuel',
                '加油站': 'fuel',
                '汽服门店': 'fuel',
                'car': 'car',
                'vehicle': 'car',
                '汽车': 'car',
                '优配服务站': 'car'
            };

            if (symbolMap[type]) {
                symbol = symbolMap[type];
            } else {
                // Substring match
                for (const key in symbolMap) {
                    if (type.includes(key)) {
                        symbol = symbolMap[key];
                        break;
                    }
                }
            }
        }
    }

    return createCustomMarkerIcon(color, symbol);
}

// ==== Leaflet.draw Setup ==== //
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

L.drawLocal = {
    draw: {
        toolbar: {
            actions: { title: '取消绘制', text: '取消' },
            finish: { title: '完成绘制', text: '完成' },
            undo: { title: '删除最后一个点', text: '删除最后一个点' },
            buttons: {
                polyline: '绘制折线',
                polygon: '绘制多边形',
                rectangle: '绘制矩形',
                circle: '绘制圆形',
                marker: '添加标记',
                circlemarker: '添加圆形标记'
            }
        },
        handlers: {
            circle: { tooltip: { start: '点击并拖动绘制圆形' }, radius: '半径' },
            circlemarker: { tooltip: { start: '点击地图放置圆形标记' } },
            marker: { tooltip: { start: '点击地图放置标记' } },
            polygon: { tooltip: { start: '点击开始绘制多边形', cont: '点击继续绘制多边形', end: '点击第一个点完成多边形' } },
            polyline: { error: '<strong>错误:</strong> 线段不能交叉!', tooltip: { start: '点击开始绘制折线', cont: '点击继续绘制折线', end: '点击最后一个点完成折线' } },
            rectangle: { tooltip: { start: '点击并拖动绘制矩形' } },
            simpleshape: { tooltip: { end: '释放鼠标完成绘制' } }
        }
    },
    edit: {
        toolbar: {
            actions: { save: { title: '保存更改', text: '保存' }, cancel: { title: '取消编辑，放弃所有更改', text: '取消' }, clearAll: { title: '清除所有图层', text: '全部清除' } },
            buttons: { edit: '编辑图层', editDisabled: '没有可编辑的图层', remove: '删除图层', removeDisabled: '没有可删除的图层' }
        },
        handlers: { edit: { tooltip: { text: '拖动控制点或标记来编辑要素', subtext: '点击取消撤销更改' } }, remove: { tooltip: { text: '点击要删除的要素' } } }
    }
};

const drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        polyline: { shapeOptions: { color: '#00ff00', weight: 3 } },
        polygon: { allowIntersection: false, shapeOptions: { color: '#ff7800', fillOpacity: 0.3 } },
        rectangle: { shapeOptions: { color: '#ff7800', fillOpacity: 0.3 } },
        circle: { shapeOptions: { color: '#ff7800', fillOpacity: 0.2 } },
        marker: true,
        circlemarker: false
    },
    edit: { featureGroup: drawnItems, remove: true }
});
map.addControl(drawControl);

// ==== UI Elements ==== //
const baseMapSelect = document.getElementById('baseMapSelect');
const exportGeoJSONBtn = document.getElementById('exportGeoJSONBtn');
const geojsonFileInput = document.getElementById('geojsonFile');
const toggleEditorBtn = document.getElementById('toggleEditorBtn');
const editorPanel = document.getElementById('editorPanel');
const geojsonEditor = document.getElementById('geojsonEditor');
const applyEditorBtn = document.getElementById('applyEditorBtn');
const layerList = document.getElementById('layerList');
const clearAllBtn = document.getElementById('clearAllBtn');
const showLabelsCheck = document.getElementById('showLabelsCheck');
const markerIconSelect = document.getElementById('markerIconSelect');

// Save slot controls
const saveSlotSelect = document.getElementById('saveSlotSelect');
const saveSlotBtn = document.getElementById('saveSlotBtn');
const loadSlotBtn = document.getElementById('loadSlotBtn');

// Legacy UI elements
const addressFileInput = document.getElementById('addressFile');
const exportBtn = document.getElementById('exportBtn');
const coordFileInput = document.getElementById('coordFile');
const togglePickerBtn = document.getElementById('togglePickerBtn');
const pickedCoordsDiv = document.getElementById('pickedCoords');
const manualNoteInput = document.getElementById('manualNote');
const addManualMarkerBtn = document.getElementById('addManualMarkerBtn');
const searchAddressInput = document.getElementById('searchAddress');
const searchBtn = document.getElementById('searchBtn');
const gotoLatInput = document.getElementById('gotoLat');
const gotoLngInput = document.getElementById('gotoLng');
const gotoCoordBtn = document.getElementById('gotoCoordBtn');
const toggleLayerPanelBtn = document.getElementById('toggleLayerPanelBtn');

// Excel UI elements
const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
const excelFileInput = document.getElementById('excelFile');
const exportExcelBtn = document.getElementById('exportExcelBtn');

// Event Tracker UI elements
const eventTrackerPanel = document.getElementById('eventTrackerPanel');
const closeEventTrackerBtn = document.getElementById('closeEventTrackerBtn');
const eventTrackerFeatureName = document.getElementById('eventTrackerFeatureName');
const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const eventNotes = document.getElementById('eventNotes');
const urlTitle = document.getElementById('urlTitle');
const urlAddress = document.getElementById('urlAddress');
const addUrlBtn = document.getElementById('addUrlBtn');
const urlList = document.getElementById('urlList');
const timelineDate = document.getElementById('timelineDate');
const timelineTitle = document.getElementById('timelineTitle');
const addTimelineBtn = document.getElementById('addTimelineBtn');
const timelineDisplay = document.getElementById('timelineDisplay');
const saveEventDataBtn = document.getElementById('saveEventDataBtn');

// ==== State Variables ==== //
let pickerMode = false;
let manualMarkerMode = false;
let layerCounter = 0;
let showLabels = false;
let currentMarkerColor = 'blue';
let contextMenuTarget = null;
let currentTrackedFeature = null; // Feature currently being tracked in event panel
let currentEditingEventId = null; // Currently editing event ID
let eventIdCounter = Date.now(); // Unique ID counter for events


// ==== Independent Event Storage System ==== //
const EVENTS_STORAGE_KEY = 'map_events_data';

// Generate unique event ID
function generateEventId() {
    return `evt_${eventIdCounter++}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all events from localStorage
function getAllEvents() {
    try {
        const data = localStorage.getItem(EVENTS_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Failed to load events:', e);
        return {};
    }
}

// Save all events to localStorage
function saveAllEvents(events) {
    try {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        console.log('Events saved:', Object.keys(events).length);
    } catch (e) {
        console.error('Failed to save events:', e);
    }
}

// Get event data for a specific feature
function getEventData(eventId) {
    const events = getAllEvents();
    return events[eventId] || null;
}

// Set event data for a specific feature
function setEventData(eventId, data) {
    const events = getAllEvents();
    events[eventId] = data;
    saveAllEvents(events);
}

// Delete event data for a specific feature
function deleteEventData(eventId) {
    const events = getAllEvents();
    if (events[eventId]) {
        delete events[eventId];
        saveAllEvents(events);
    }
}

// Initialize event data structure
function initEventData() {
    return {
        todos: [],
        notes: '',
        urls: [],
        timeline: []
    };
}


// ==== Save Slot Management (Legacy - kept for compatibility) ==== //
function updateSlotOptions() {
    if (!saveSlotSelect) return; // Element removed, skip

    const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
    slots.forEach((slotId, index) => {
        const meta = localStorage.getItem(`geojson_${slotId}_meta`);
        const option = saveSlotSelect.options[index];
        if (!option) return;

        if (meta) {
            try {
                const { timestamp } = JSON.parse(meta);
                const date = new Date(timestamp);
                const dateStr = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                option.text = `存档 ${index + 1} (${dateStr})`;
            } catch (e) {
                option.text = `存档 ${index + 1} (已保存)`;
            }
        } else {
            option.text = `存档 ${index + 1} (空)`;
        }
    });
}

// Initialize slot options on page load
updateSlotOptions();


// ==== Helper Functions ==== //
function updateLayerList() {
    layerList.innerHTML = '';
    let index = 0;
    drawnItems.eachLayer(layer => {
        const item = document.createElement('div');
        item.className = 'layer-item';

        // Determine type and icon
        let type, iconClass;
        if (layer instanceof L.Marker) {
            type = '标记';
            const symbol = layer.feature?.properties?.['marker-symbol'] || 'default';
            iconClass = MARKER_ICONS[symbol]?.class || MARKER_ICONS['default'].class;
        } else if (layer instanceof L.Circle) {
            type = '圆形';
            iconClass = 'fa-solid fa-circle';
        } else if (layer instanceof L.Rectangle) {
            type = '矩形';
            iconClass = 'fa-solid fa-square';
        } else if (layer instanceof L.Polygon) {
            type = '多边形';
            iconClass = 'fa-solid fa-draw-polygon';
        } else if (layer instanceof L.Polyline) {
            type = '折线';
            iconClass = 'fa-solid fa-route';
        } else {
            type = '图层';
            iconClass = 'fa-solid fa-layer-group';
        }

        const name = layer.options.name || `${type} ${index + 1}`;
        const color = layer.feature?.properties?.['marker-color'] || '#4a90e2';

        // Get event count for markers
        const events = layer.feature?.properties?.events || [];
        const eventBadge = layer instanceof L.Marker && events.length > 0
            ? `<span class="event-badge">${events.length}</span>`
            : '';

        item.innerHTML = `
            <button class="layer-btn-main" onclick="focusOnLayer(${layer._leaflet_id})" title="点击定位到此图层">
                <span class="layer-icon" style="color: ${color}"><i class="${iconClass}"></i></span>
                <span class="layer-name">${name}</span>
                ${eventBadge}
                <span class="layer-type">${type}</span>
            </button>
            <div class="layer-actions">
                <button class="layer-btn" onclick="toggleLayerVisibility(${layer._leaflet_id})" title="隐藏/显示"><i class="fa-solid fa-eye"></i></button>
                <button class="layer-btn" onclick="renameLayer(${layer._leaflet_id})" title="重命名"><i class="fa-solid fa-pen"></i></button>
                <button class="layer-btn delete" onclick="deleteLayer(${layer._leaflet_id})" title="删除"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        layerList.appendChild(item);
        index++;
    });
    updateGeoJSONEditor();
}

// Focus map on a specific layer
function focusOnLayer(leafletId) {
    const layer = drawnItems.getLayer(leafletId);
    if (!layer) return;

    if (layer instanceof L.Marker) {
        map.setView(layer.getLatLng(), map.getZoom());
        layer.openPopup();
    } else if (layer.getBounds) {
        map.fitBounds(layer.getBounds());
    }
}


function updateGeoJSONEditor() {
    const geo = drawnItems.toGeoJSON();
    geojsonEditor.value = JSON.stringify(geo, null, 2);
}

function exportGeoJSON() {
    const data = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', 'map.geojson');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importGeoJSON(raw) {
    try {
        const geo = typeof raw === 'string' ? JSON.parse(raw) : raw;
        L.geoJSON(geo, {
            pointToLayer: (feature, latlng) => {
                const icon = getMarkerIcon(feature.properties);
                const marker = L.marker(latlng, { icon });
                marker.feature = { properties: feature.properties || {} };
                bindMarkerContextMenu(marker);
                return marker;
            },
            style: feature => {
                const style = {};
                if (feature.properties) {
                    if (feature.properties.stroke) style.color = feature.properties.stroke;
                    if (feature.properties['stroke-width']) style.weight = feature.properties['stroke-width'];
                    if (feature.properties['stroke-opacity']) style.opacity = feature.properties['stroke-opacity'];
                    if (feature.properties.fill) style.fillColor = feature.properties.fill;
                    if (feature.properties['fill-opacity']) style.fillOpacity = feature.properties['fill-opacity'];
                    if (feature.properties.dashArray || feature.properties.style === 'dashed') style.dashArray = '10,10';
                }
                return style;
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    layer.options.name = feature.properties.name;
                }
                if (layer instanceof L.Circle && feature.properties) {
                    if (feature.properties.dashArray || feature.properties.style === 'dashed') {
                        layer.setStyle({ dashArray: '10,10', weight: 2 });
                    }
                }
                // Bind popup for point markers with event display
                if (layer instanceof L.Marker) {
                    const latlng = layer.getLatLng();
                    const name = feature.properties?.name || '';
                    const type = feature.properties?.type || '';
                    const address = feature.properties?.address || '';
                    const events = feature.properties?.events || [];

                    // Build event list HTML (show up to 3 recent events)
                    let eventListHtml = '';
                    if (events.length > 0) {
                        const recentEvents = events.slice(-3).reverse();
                        eventListHtml = `<div class="popup-events">
                            <div class="popup-events-header">📋 事件 (${events.length})</div>
                            ${recentEvents.map(evt => `
                                <div class="popup-event-item">
                                    <span class="popup-event-date">${evt.created?.split('T')[0] || '无日期'}</span>
                                    <span class="popup-event-name">${evt.eventName || '未命名事件'}</span>
                                </div>
                            `).join('')}
                            ${events.length > 3 ? `<div class="popup-event-more">还有 ${events.length - 3} 个事件...</div>` : ''}
                        </div>`;
                    }

                    const popupHtml = `<div class="marker-popup">
                        <h3>${name}</h3>
                        <p>类型: ${type}<br>地址: ${address}<br>
                        经纬度: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)} 
                        <button onclick="navigator.clipboard.writeText('${latlng.lat},${latlng.lng}')" class="btn-copy">复制</button></p>
                        ${eventListHtml}
                        <div class="popup-actions">
                            <button onclick="openEventTrackerForLayerId(${layer._leaflet_id})" class="btn-popup-action">
                                <i class="fa-solid fa-calendar-plus"></i> ${events.length > 0 ? '管理事件' : '添加事件'}
                            </button>
                        </div>
                    </div>`;
                    layer.bindPopup(popupHtml, { maxWidth: 300 });
                }
                drawnItems.addLayer(layer);
                if (layer instanceof L.Marker) bindMarkerContextMenu(layer);
            }
        });
        updateLayerList();
        if (drawnItems.getLayers().length) map.fitBounds(drawnItems.getBounds());
    } catch (e) {
        alert('GeoJSON 解析错误：' + e.message);
    }
}

function updateLabels() {
    drawnItems.eachLayer(layer => {
        if (layer.getTooltip()) layer.unbindTooltip();
        if (showLabels && layer.options.name) {
            layer.bindTooltip(layer.options.name, { permanent: true, direction: 'center', className: 'layer-label' });
        }
    });
}

// ==== Context Menu Functions ==== //
function bindMarkerContextMenu(marker) {
    marker.on('contextmenu', e => {
        contextMenuTarget = marker;
        const menu = document.getElementById('contextMenu');
        menu.style.left = e.originalEvent.pageX + 'px';
        menu.style.top = e.originalEvent.pageY + 'px';
        menu.style.display = 'block';
    });
}

function hideContextMenu() {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'none';
    contextMenuTarget = null;
}

function editMarkerProperties() {
    if (!contextMenuTarget) return;
    const newName = prompt('输入新名称：', contextMenuTarget.options.name || '');
    if (newName !== null) {
        contextMenuTarget.options.name = newName;
        if (!contextMenuTarget.feature) contextMenuTarget.feature = { properties: {} };
        contextMenuTarget.feature.properties.name = newName;
        updateLayerList();
        updateLabels();
    }
    hideContextMenu();
}

// ==== Icon Picker Modal Functions ==== //
let selectedColor = '#4a90e2';
let selectedIcon = 'default';
let iconPickerTarget = null;

function openIconPicker() {
    if (!contextMenuTarget) return;
    iconPickerTarget = contextMenuTarget;
    hideContextMenu();

    // Get current marker settings
    const props = iconPickerTarget.feature?.properties || {};
    selectedColor = props['marker-color'] || '#4a90e2';
    selectedIcon = props['marker-symbol'] || 'default';

    // Render color palette
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';
    Object.entries(MARKER_COLORS).forEach(([key, config]) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch' + (config.hex === selectedColor ? ' selected' : '');
        swatch.style.backgroundColor = config.hex;
        swatch.title = config.label;
        swatch.onclick = () => selectColor(key, config.hex);
        colorPalette.appendChild(swatch);
    });

    // Render icon grid
    const iconGrid = document.getElementById('iconGrid');
    iconGrid.innerHTML = '';
    Object.entries(MARKER_ICONS).forEach(([key, config]) => {
        const option = document.createElement('div');
        option.className = 'icon-option' + (key === selectedIcon ? ' selected' : '');
        option.title = config.label;
        option.innerHTML = `<i class="${config.class}"></i>`;
        option.onclick = () => selectIcon(key);
        iconGrid.appendChild(option);
    });

    // Update preview
    updateIconPreview();

    // Show modal
    document.getElementById('iconPickerModal').style.display = 'flex';
}

function selectColor(key, hex) {
    selectedColor = hex;
    document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    updateIconPreview();
}

function selectIcon(key) {
    selectedIcon = key;
    document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    updateIconPreview();
}

function updateIconPreview() {
    const previewCircle = document.getElementById('previewCircle');
    const previewTip = document.getElementById('previewTip');
    const previewIcon = document.getElementById('previewIcon');
    const label = document.getElementById('selectedIconLabel');

    previewCircle.style.backgroundColor = selectedColor;
    previewTip.style.borderTopColor = selectedColor;
    previewIcon.className = MARKER_ICONS[selectedIcon]?.class || MARKER_ICONS['default'].class;
    label.textContent = MARKER_ICONS[selectedIcon]?.label || '定位点';
}

function closeIconPicker() {
    document.getElementById('iconPickerModal').style.display = 'none';
    iconPickerTarget = null;
}

function applyIconSelection() {
    if (!iconPickerTarget) return;

    const icon = createCustomMarkerIcon(selectedColor, selectedIcon);
    iconPickerTarget.setIcon(icon);

    if (!iconPickerTarget.feature) iconPickerTarget.feature = { properties: {} };
    iconPickerTarget.feature.properties['marker-color'] = selectedColor;
    iconPickerTarget.feature.properties['marker-symbol'] = selectedIcon;

    updateLayerList();
    closeIconPicker();
}

// Legacy function for backward compatibility
function changeMarkerIcon() {
    openIconPicker();
}


function deleteSelectedMarker() {
    if (!contextMenuTarget) return;
    drawnItems.removeLayer(contextMenuTarget);
    updateLayerList();
    hideContextMenu();
}

function openEventTrackerFromMenu() {
    if (!contextMenuTarget) return;
    openEventTracker(contextMenuTarget);
    hideContextMenu();
}

// Open event tracker for a specific layer by ID (used in popup)
function openEventTrackerForLayerId(leafletId) {
    const layer = drawnItems.getLayer(leafletId);
    if (!layer) return;
    map.closePopup();
    openEventTracker(layer);
}

map.on('click', () => hideContextMenu());

// ==== Event Listeners ==== //
baseMapSelect.addEventListener('change', () => {
    const sel = baseMapSelect.value;
    Object.values(baseLayers).forEach(l => map.removeLayer(l));
    baseLayers[sel].addTo(map);
});

map.on(L.Draw.Event.CREATED, e => {
    const layer = e.layer;
    layer.options.name = `图层 ${++layerCounter} `;
    if (layer instanceof L.Marker) {
        const icon = createCustomMarkerIcon('#4a90e2', 'default');
        layer.setIcon(icon);
        layer.feature = { properties: { 'marker-color': '#4a90e2' } };
        bindMarkerContextMenu(layer);
    }
    drawnItems.addLayer(layer);
    updateLayerList();
    updateLabels();
});

map.on(L.Draw.Event.EDITED, () => updateLayerList());
map.on(L.Draw.Event.DELETED, () => updateLayerList());

exportGeoJSONBtn.addEventListener('click', exportGeoJSON);

// ==== Enhanced GeoJSON Import with Modal ==== //
let pendingImportData = null;

geojsonFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const geojsonStr = ev.target.result;
            const geojson = JSON.parse(geojsonStr);
            pendingImportData = geojsonStr;

            // Calculate geometry statistics
            const stats = { Point: 0, LineString: 0, Polygon: 0, Other: 0 };
            const features = geojson.features || [geojson];
            features.forEach(f => {
                const type = f.geometry?.type;
                if (type === 'Point' || type === 'MultiPoint') stats.Point++;
                else if (type === 'LineString' || type === 'MultiLineString') stats.LineString++;
                else if (type === 'Polygon' || type === 'MultiPolygon') stats.Polygon++;
                else stats.Other++;
            });

            // Render stats
            const statsDiv = document.getElementById('importStats');
            statsDiv.innerHTML = `
                <div class="stat-item">
                    <div class="stat-icon point"><i class="fa-solid fa-location-dot"></i></div>
                    <div class="stat-info"><div class="stat-count">${stats.Point}</div><div class="stat-label">点标记</div></div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon line"><i class="fa-solid fa-route"></i></div>
                    <div class="stat-info"><div class="stat-count">${stats.LineString}</div><div class="stat-label">线段</div></div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon polygon"><i class="fa-solid fa-draw-polygon"></i></div>
                    <div class="stat-info"><div class="stat-count">${stats.Polygon}</div><div class="stat-label">多边形</div></div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon other"><i class="fa-solid fa-shapes"></i></div>
                    <div class="stat-info"><div class="stat-count">${stats.Other}</div><div class="stat-label">其他</div></div>
                </div>
            `;

            // Show import modal
            document.getElementById('importModal').style.display = 'flex';
        } catch (e) {
            alert('GeoJSON 解析错误：' + e.message);
        }
    };
    reader.readAsText(file);
    // Reset file input for re-selection
    e.target.value = '';
});

function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
    pendingImportData = null;
}

function confirmImport() {
    if (!pendingImportData) return;

    const mode = document.querySelector('input[name="importMode"]:checked')?.value || 'replace';

    if (mode === 'replace') {
        drawnItems.clearLayers();
    }

    importGeoJSON(pendingImportData);
    closeImportModal();
}

// ==== Share Feature ==== //
let currentShareCanvas = null;

// Share button event listener
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', openShareModal);
}

async function openShareModal() {
    const modal = document.getElementById('shareModal');
    const loading = document.getElementById('sharePreviewLoading');
    const previewImg = document.getElementById('sharePreviewImage');
    const status = document.getElementById('shareStatus');

    // Reset state
    loading.style.display = 'flex';
    previewImg.style.display = 'none';
    status.style.display = 'none';
    currentShareCanvas = null;

    // Show modal
    modal.style.display = 'flex';

    try {
        // Capture map screenshot
        const mapElement = document.getElementById('map');
        currentShareCanvas = await html2canvas(mapElement, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#1a1a1a',
            scale: 2 // Higher quality
        });

        // Show preview
        previewImg.src = currentShareCanvas.toDataURL('image/png');
        loading.style.display = 'none';
        previewImg.style.display = 'block';
    } catch (e) {
        console.error('Screenshot failed:', e);
        showShareStatus('截图生成失败: ' + e.message, 'error');
        loading.style.display = 'none';
    }
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
    currentShareCanvas = null;
}

function showShareStatus(message, type) {
    const status = document.getElementById('shareStatus');
    status.textContent = message;
    status.className = 'share-status ' + type;
    status.style.display = 'block';

    // Auto hide after 3 seconds
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}

function downloadMapImage() {
    if (!currentShareCanvas) {
        showShareStatus('请先等待截图生成完成', 'error');
        return;
    }

    const link = document.createElement('a');
    link.download = `map_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = currentShareCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showShareStatus('✅ 图片已下载', 'success');
}

async function copyMapImage() {
    if (!currentShareCanvas) {
        showShareStatus('请先等待截图生成完成', 'error');
        return;
    }

    try {
        // Convert canvas to blob
        const blob = await new Promise(resolve => currentShareCanvas.toBlob(resolve, 'image/png'));

        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);

        showShareStatus('✅ 图片已复制到剪贴板', 'success');
    } catch (e) {
        console.error('Copy failed:', e);
        showShareStatus('复制失败，请尝试下载图片', 'error');
    }
}

function copyShareLink() {
    try {
        // Generate shareable link with GeoJSON data
        const geojsonData = JSON.stringify(drawnItems.toGeoJSON());
        const center = map.getCenter();
        const zoom = map.getZoom();

        // Create URL with encoded data
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        params.set('lat', center.lat.toFixed(6));
        params.set('lng', center.lng.toFixed(6));
        params.set('zoom', zoom);

        // Compress and encode GeoJSON (for small datasets)
        if (geojsonData.length < 2000) {
            params.set('data', btoa(encodeURIComponent(geojsonData)));
        }

        const shareUrl = baseUrl + '?' + params.toString();

        navigator.clipboard.writeText(shareUrl);
        showShareStatus('✅ 链接已复制到剪贴板', 'success');
    } catch (e) {
        console.error('Copy link failed:', e);
        showShareStatus('复制链接失败', 'error');
    }
}

// Load shared data from URL on page load
function loadFromShareUrl() {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    const zoom = parseInt(params.get('zoom'));
    const data = params.get('data');

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        map.setView([lat, lng], zoom);
    }

    if (data) {
        try {
            const geojsonStr = decodeURIComponent(atob(data));
            importGeoJSON(geojsonStr);
        } catch (e) {
            console.error('Failed to load shared data:', e);
        }
    }
}

// Call on page load
setTimeout(loadFromShareUrl, 500);

toggleEditorBtn.addEventListener('click', () => {
    if (editorPanel.style.display === 'none') {
        editorPanel.style.display = 'flex';
        toggleEditorBtn.textContent = '隐藏代码编辑器';
        updateGeoJSONEditor();
    } else {
        editorPanel.style.display = 'none';
        toggleEditorBtn.textContent = '显示代码编辑器';
    }
});

// ==== Toolbar Toggle ==== //
const toggleToolbarBtn = document.getElementById('toggleToolbarBtn');
const controlsPanel = document.getElementById('controls');

if (toggleToolbarBtn && controlsPanel) {
    toggleToolbarBtn.addEventListener('click', () => {
        controlsPanel.classList.toggle('collapsed');
        // Invalidate map size after animation
        setTimeout(() => map.invalidateSize(), 350);
    });
}


applyEditorBtn.addEventListener('click', () => {
    drawnItems.clearLayers();
    importGeoJSON(geojsonEditor.value);
});

clearAllBtn.addEventListener('click', () => {
    if (confirm('确定要清空所有图层吗？')) {
        drawnItems.clearLayers();
        updateLayerList();
    }
});

showLabelsCheck.addEventListener('change', e => {
    showLabels = e.target.checked;
    updateLabels();
});

markerIconSelect.addEventListener('change', e => {
    currentMarkerColor = e.target.value;
});

// Save Slot Event Listeners (Legacy - elements may be removed)
if (saveSlotBtn && saveSlotSelect) {
    saveSlotBtn.addEventListener('click', () => {
        const slot = saveSlotSelect.value;
        const content = geojsonEditor.value;
        const meta = {
            timestamp: Date.now(),
            size: content.length
        };
        localStorage.setItem(`geojson_${slot}`, content);
        localStorage.setItem(`geojson_${slot}_meta`, JSON.stringify(meta));
        updateSlotOptions();
        console.log('已保存到存档');
    });
}

if (loadSlotBtn && saveSlotSelect) {
    loadSlotBtn.addEventListener('click', () => {
        const slot = saveSlotSelect.value;
        const content = localStorage.getItem(`geojson_${slot}`);
        if (content) {
            geojsonEditor.value = content;
        } else {
            console.log('存档为空');
        }
    });
}


// ---- Legacy Features ---- //
exportBtn.addEventListener('click', () => {
    const rows = [];
    drawnItems.eachLayer(l => {
        if (l instanceof L.Marker) {
            const ll = l.getLatLng();
            rows.push(`${ll.lat},${ll.lng} `);
        }
    });
    const csv = 'data:text/csv;charset=utf-8,latitude,longitude\n' + rows.join('\n');
    const a = document.createElement('a');
    a.setAttribute('href', encodeURI(csv));
    a.setAttribute('download', 'coordinates.csv');
    document.body.appendChild(a);
    a.click();
});

// ==== Excel Functions ==== //

// Download Excel Template
downloadTemplateBtn.addEventListener('click', () => {
    const templateData = [
        {
            '经度 (Longitude)': 120.38,
            '纬度 (Latitude)': 36.07,
            '名称 (Name)': '示例标记',
            '类型 (Type)': 'shop',
            '地址 (Address)': '山东省青岛市市南区',
            '标记颜色 (marker-color)': '#4a90e2',
            '标记符号 (marker-symbol)': 'shop'
        }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '标记数据');
    XLSX.writeFile(wb, '地图标记导入模板.xlsx');
});

// Export to Excel with all fields
exportExcelBtn.addEventListener('click', () => {
    const data = [];
    drawnItems.eachLayer(l => {
        if (l instanceof L.Marker) {
            const ll = l.getLatLng();
            const props = l.feature?.properties || {};
            data.push({
                '经度 (Longitude)': ll.lng,
                '纬度 (Latitude)': ll.lat,
                '名称 (Name)': props.name || '',
                '类型 (Type)': props.type || '',
                '地址 (Address)': props.address || '',
                '标记颜色 (marker-color)': props['marker-color'] || '#4a90e2',
                '标记符号 (marker-symbol)': props['marker-symbol'] || 'default'
            });
        }
    });

    if (data.length === 0) {
        alert('没有标记可导出');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '标记数据');
    XLSX.writeFile(wb, '地图标记数据.xlsx');
});

// Import from Excel
excelFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            let addedCount = 0;
            rows.forEach(row => {
                // Support multiple column name formats
                const lng = row['经度 (Longitude)'] || row['Longitude'] || row['lng'] || row['经度'];
                const lat = row['纬度 (Latitude)'] || row['Latitude'] || row['lat'] || row['纬度'];

                if (!lng || !lat || isNaN(parseFloat(lng)) || isNaN(parseFloat(lat))) {
                    return;
                }

                const properties = {
                    name: row['名称 (Name)'] || row['Name'] || row['name'] || row['名称'] || '未命名',
                    type: row['类型 (Type)'] || row['Type'] || row['type'] || row['类型'] || '',
                    address: row['地址 (Address)'] || row['Address'] || row['address'] || row['地址'] || '',
                    'marker-color': row['标记颜色 (marker-color)'] || row['marker-color'] || row['color'] || '#4a90e2',
                    'marker-symbol': row['标记符号 (marker-symbol)'] || row['marker-symbol'] || row['symbol'] || 'default'
                };

                const icon = getMarkerIcon(properties);
                const marker = L.marker([parseFloat(lat), parseFloat(lng)], { icon });
                marker.feature = { properties };

                // Bind popup
                const latlng = marker.getLatLng();
                const popupHtml = `<h3>${properties.name}</h3>` +
                    `<p>类型: ${properties.type}<br>地址: ${properties.address}<br>` +
                    `经纬度: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)} ` +
                    `<button onclick="navigator.clipboard.writeText('${latlng.lat},${latlng.lng}')">复制</button></p>`;
                marker.bindPopup(popupHtml);

                bindMarkerContextMenu(marker);
                drawnItems.addLayer(marker);
                addedCount++;
            });

            if (addedCount > 0) {
                updateLayerList();
                map.fitBounds(drawnItems.getBounds());
                alert(`成功导入 ${addedCount} 个标记`);
            } else {
                alert('未找到有效的坐标数据');
            }
        } catch (err) {
            console.error(err);
            alert('Excel 文件解析失败：' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

// Enhanced Coord Import with PapaParse and Type Detection
coordFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const rows = results.data;
            let addedCount = 0;

            rows.forEach(row => {
                let lat, lng;

                const latKeys = ['纬度', 'Latitude', 'lat', 'latitude', '纬度 (Latitude)'];
                const lngKeys = ['经度', 'Longitude', 'lng', 'longitude', '经度 (Longitude)'];

                for (const key of latKeys) {
                    if (row[key]) { lat = parseFloat(row[key]); break; }
                }
                for (const key of lngKeys) {
                    if (row[key]) { lng = parseFloat(row[key]); break; }
                }

                if (!isNaN(lat) && !isNaN(lng)) {
                    const name = row['门店'] || row['name'] || row['Name'] || row['名称'] || '未命名';
                    const type = row['类型'] || row['type'] || row['Type'] || '';
                    const address = row['地址'] || row['address'] || row['Address'] || '';

                    const properties = {
                        name: name,
                        type: type,
                        address: address
                    };

                    const icon = getMarkerIcon(properties);
                    const marker = L.marker([lat, lng], { icon: icon });

                    marker.feature = { properties: properties };

                    let popupContent = `< b > ${name}</b > `;
                    if (type) popupContent += `< br > 类型: ${type} `;
                    if (address) popupContent += `< br > 地址: ${address} `;
                    marker.bindPopup(popupContent);

                    bindMarkerContextMenu(marker);
                    drawnItems.addLayer(marker);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                updateLayerList();
                map.fitBounds(drawnItems.getBounds());
                alert(`成功导入 ${addedCount} 个标记`);
            } else {
                alert('未找到有效的坐标数据，请检查 CSV 文件格式');
            }
        },
        error: function (err) {
            alert('CSV 解析失败: ' + err.message);
        }
    });
});

if (addressFileInput) {
    addressFileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async ev => {
            const rows = Papa.parse(ev.target.result, { header: true }).data;
            for (const row of rows) {
                const address = row.address || row.Address || row.地址;
                if (!address) continue;
                try {
                    const resp = await fetch(`${AMAP_GEOCODE_URL}?key=${AMAP_API_KEY}&address=${encodeURIComponent(address)}`);
                    const data = await resp.json();
                    if (data.geocodes && data.geocodes.length) {
                        const [lng, lat] = data.geocodes[0].location.split(',');
                        const icon = createCustomMarkerIcon('#4a90e2', 'default');
                        const marker = L.marker([parseFloat(lat), parseFloat(lng)], { icon });
                        marker.feature = { properties: { name: address } };
                        bindMarkerContextMenu(marker);
                        drawnItems.addLayer(marker);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            updateLayerList();
            if (drawnItems.getLayers().length) map.fitBounds(drawnItems.getBounds());
        };
        reader.readAsText(file);
    });
}


togglePickerBtn.addEventListener('click', () => {
    pickerMode = !pickerMode;
    togglePickerBtn.textContent = pickerMode ? '关闭坐标拾取' : '启用坐标拾取';
    pickedCoordsDiv.textContent = pickerMode ? '点击地图拾取坐标...' : '';
    map.getContainer().style.cursor = pickerMode ? 'crosshair' : '';
});

addManualMarkerBtn.addEventListener('click', () => {
    manualMarkerMode = !manualMarkerMode;
    addManualMarkerBtn.textContent = manualMarkerMode ? '取消添加' : '点击地图添加';
    map.getContainer().style.cursor = manualMarkerMode ? 'crosshair' : '';
});

// Layer panel toggle
toggleLayerPanelBtn.addEventListener('click', () => {
    const panel = document.getElementById('layerPanel');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'flex';
        toggleLayerPanelBtn.textContent = '隐藏图层面板';
    } else {
        panel.style.display = 'none';
        toggleLayerPanelBtn.textContent = '显示图层面板';
    }
});

searchBtn.addEventListener('click', async () => {
    const addr = searchAddressInput.value.trim();
    if (!addr) { alert('请输入地址'); return; }
    try {
        const resp = await fetch(`${AMAP_GEOCODE_URL}?key=${AMAP_API_KEY}&address=${encodeURIComponent(addr)}`);
        const data = await resp.json();
        if (data.geocodes && data.geocodes.length) {
            const [lng, lat] = data.geocodes[0].location.split(',');
            const latN = parseFloat(lat), lngN = parseFloat(lng);
            map.setView([latN, lngN], 15);
            const icon = createCustomMarkerIcon('#4a90e2', 'default');
            const marker = L.marker([latN, lngN], { icon });
            marker.feature = { properties: { name: addr } };
            bindMarkerContextMenu(marker);
            drawnItems.addLayer(marker);
            updateLayerList();
        } else {
            alert('未找到该地址');
        }
    } catch (e) {
        console.error(e);
        alert('搜索失败');
    }
});

gotoCoordBtn.addEventListener('click', () => {
    const lat = parseFloat(gotoLatInput.value);
    const lng = parseFloat(gotoLngInput.value);
    if (isNaN(lat) || isNaN(lng)) { alert('请输入有效坐标'); return; }
    map.setView([lat, lng], 15);
    const icon = createCustomMarkerIcon('#4a90e2', 'default');
    const marker = L.marker([lat, lng], { icon });
    marker.feature = { properties: { name: `坐标: ${lat.toFixed(6)}, ${lng.toFixed(6)} ` } };
    bindMarkerContextMenu(marker);
    drawnItems.addLayer(marker);
    updateLayerList();
});

map.on('click', e => {
    if (pickerMode) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        pickedCoordsDiv.textContent = `纬度: ${lat}, 经度: ${lng} `;
        if (navigator.clipboard) navigator.clipboard.writeText(`${lat},${lng} `);
        return;
    }
    if (manualMarkerMode) {
        const note = manualNoteInput.value.trim() || '无备注';
        const icon = createCustomMarkerIcon('#4a90e2', 'default');
        const marker = L.marker(e.latlng, { icon });
        marker.feature = { properties: { name: note } };
        bindMarkerContextMenu(marker);
        drawnItems.addLayer(marker);
        manualNoteInput.value = '';
        manualMarkerMode = false;
        addManualMarkerBtn.textContent = '点击地图添加';
        map.getContainer().style.cursor = '';
        updateLayerList();
        return;
    }
});

// ==== Global Functions for Layer Management ==== //
window.toggleLayerVisibility = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            if (map.hasLayer(l)) map.removeLayer(l); else map.addLayer(l);
        }
    });
};
window.renameLayer = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            const newName = prompt('输入新名称：', l.options.name || '');
            if (newName !== null) {
                l.options.name = newName;
                if (!l.feature) l.feature = { properties: {} };
                l.feature.properties.name = newName;
                updateLayerList();
                updateLabels();
            }
        }
    });
};
window.deleteLayer = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            drawnItems.removeLayer(l);
            updateLayerList();
        }
    });
};

// ==== Expose Context Menu Functions ==== //
window.editMarkerProperties = editMarkerProperties;
window.changeMarkerIcon = changeMarkerIcon;
window.deleteSelectedMarker = deleteSelectedMarker;
window.openEventTrackerFromMenu = openEventTrackerFromMenu;

// ==== Global Event Tracker Functions (for onclick) ==== //
window.closeEventTracker = function () {
    console.log('closeEventTracker called');
    if (currentTrackedFeature && currentTrackedFeature._eventId) {
        const eventData = currentTrackedFeature._currentEventData || initEventData();
        eventData.notes = eventNotes.value;
        setEventData(currentTrackedFeature._eventId, eventData);
        console.log('Event data auto-saved on close');
    }
    eventTrackerPanel.style.display = 'none';
    currentTrackedFeature = null;
    alert('面板已关闭');
};

window.saveEventData = function () {
    console.log('saveEventData called');
    if (!currentTrackedFeature) {
        alert('没有选中的图层');
        return;
    }
    const eventData = currentTrackedFeature._currentEventData || initEventData();
    eventData.notes = eventNotes.value;
    setEventData(currentTrackedFeature._eventId, eventData);
    alert('✅ 事件数据已保存！');
};


// ==== Event Tracker System (Multi-Event Support) ==== //

// Get all events for a marker (from feature properties)
function getMarkerEvents(feature) {
    if (!feature) return [];
    // Ensure feature structure exists
    if (!feature.feature) {
        feature.feature = { type: 'Feature', properties: {}, geometry: null };
    }
    if (!feature.feature.properties) {
        feature.feature.properties = {};
    }
    return feature.feature.properties.events || [];
}

// Save all events for a marker (to feature properties)
function saveMarkerEvents(feature, events) {
    if (!feature) return;
    // Ensure feature structure exists
    if (!feature.feature) {
        feature.feature = { type: 'Feature', properties: {}, geometry: null };
    }
    if (!feature.feature.properties) {
        feature.feature.properties = {};
    }
    feature.feature.properties.events = events;

    // Update GeoJSON editor to reflect changes
    updateGeoJSONEditor();
    console.log('Events saved to feature:', events.length);
}

// Open event tracker for a feature - shows event list
function openEventTracker(feature) {
    currentTrackedFeature = feature;
    currentEditingEventId = null;

    // Load data into UI
    const featureName = feature.options?.name || feature.feature?.properties?.name || '未命名特征';
    eventTrackerFeatureName.textContent = `📍 ${featureName}`;

    // Show list view, hide edit view
    showEventList();

    // Show panel
    eventTrackerPanel.style.display = 'flex';
    console.log('Event tracker opened');
}


// Show event list view
function showEventList() {
    document.getElementById('eventListView').style.display = 'flex';
    document.getElementById('eventEditView').style.display = 'none';

    renderEventList();
}

// Render the event list
function renderEventList() {
    const container = document.getElementById('eventListContainer');
    if (!currentTrackedFeature) return;

    const events = getMarkerEvents(currentTrackedFeature);

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📋 暂无事件</p>
                <p>点击下方按钮添加第一个事件</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedEvents = [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = sortedEvents.map(event => `
        <div class="event-card" onclick="editEvent('${event.id}')">
            <div class="event-card-info">
                <div class="event-card-date">${formatEventDate(event.createdAt)}</div>
                <div class="event-card-name">${event.name || '未命名事件'}</div>
            </div>
            <div class="event-card-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); editEvent('${event.id}')">编辑</button>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteEvent('${event.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

// Format event date for display
function formatEventDate(dateString) {
    if (!dateString) return '未知日期';
    const d = new Date(dateString);
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/\//g, '-');
}

// Create new event
function createNewEvent() {
    if (!currentTrackedFeature) return;

    const newEvent = {
        id: generateEventId(),
        name: '',
        createdAt: new Date().toISOString(),
        todos: [],
        notes: '',
        urls: [],
        timeline: []
    };

    // Add to events list
    const events = getMarkerEvents(currentTrackedFeature);
    events.push(newEvent);
    saveMarkerEvents(currentTrackedFeature, events);

    // Open edit view
    editEvent(newEvent.id);

}

// Edit an event
function editEvent(eventId) {
    if (!currentTrackedFeature) return;

    currentEditingEventId = eventId;
    const events = getMarkerEvents(currentTrackedFeature);
    const event = events.find(e => e.id === eventId);

    if (!event) {
        alert('事件未找到');
        return;
    }

    // Store current event data
    currentTrackedFeature._currentEventData = event;

    // Switch to edit view
    document.getElementById('eventListView').style.display = 'none';
    document.getElementById('eventEditView').style.display = 'flex';

    // Load event data into form
    document.getElementById('currentEventName').value = event.name || '';
    eventNotes.value = event.notes || '';
    renderTodoList(event.todos || []);
    renderUrlList(event.urls || []);
    renderTimeline(event.timeline || []);
    renderAttachmentList(event.attachments || []);
}


// Delete an event
function deleteEvent(eventId) {
    if (!currentTrackedFeature) return;

    if (!confirm('确定删除此事件？')) return;

    const events = getMarkerEvents(currentTrackedFeature);
    const index = events.findIndex(e => e.id === eventId);

    if (index !== -1) {
        events.splice(index, 1);
        saveMarkerEvents(currentTrackedFeature, events);
        renderEventList();
    }

}

// Save current event
function saveCurrentEvent() {
    if (!currentTrackedFeature || !currentEditingEventId) {
        console.log('没有正在编辑的事件');
        return;
    }

    const events = getMarkerEvents(currentTrackedFeature);
    const eventIndex = events.findIndex(e => e.id === currentEditingEventId);

    if (eventIndex === -1) {
        console.log('事件未找到');
        return;
    }

    // Update event data
    events[eventIndex].name = document.getElementById('currentEventName').value || '未命名事件';
    events[eventIndex].notes = eventNotes.value;
    events[eventIndex].todos = currentTrackedFeature._currentEventData?.todos || [];
    events[eventIndex].urls = currentTrackedFeature._currentEventData?.urls || [];
    events[eventIndex].timeline = currentTrackedFeature._currentEventData?.timeline || [];
    events[eventIndex].attachments = currentTrackedFeature._currentEventData?.attachments || [];

    saveMarkerEvents(currentTrackedFeature, events);


    // Visual feedback without blocking alert

    const btn = document.getElementById('saveEventDataBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        btn.style.background = '#2ecc71';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }
    console.log('事件已保存');
}


// Make functions globally accessible
window.createNewEvent = createNewEvent;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.showEventList = showEventList;
window.saveCurrentEvent = saveCurrentEvent;

// Wrapper functions for onclick buttons
window.addTodoItemClick = function () { addTodoItem(); };
window.addUrlItemClick = function () { addUrlItem(); };
window.addTimelineEventClick = function () { addTimelineEvent(); };

// ==== Event Archive System ==== //

// Save events to a slot (includes marker info)
function saveEventSlot() {
    const slotSelect = document.getElementById('eventSlotSelect');
    if (!slotSelect) return;

    const slotKey = slotSelect.value;
    const eventArchive = [];

    // Iterate through all markers and collect events
    drawnItems.eachLayer(layer => {
        const events = getMarkerEvents(layer);
        if (events && events.length > 0) {
            // Get layer position
            let coords = null;
            if (layer.getLatLng) {
                const ll = layer.getLatLng();
                coords = { lat: ll.lat, lng: ll.lng };
            } else if (layer.getBounds) {
                const center = layer.getBounds().getCenter();
                coords = { lat: center.lat, lng: center.lng };
            }

            // Get layer name
            const name = layer.options?.name || layer.feature?.properties?.name || '未命名';

            eventArchive.push({
                name: name,
                coords: coords,
                events: events
            });
        }
    });

    if (eventArchive.length === 0) {
        console.log('没有事件需要保存');
        return;
    }

    localStorage.setItem(slotKey, JSON.stringify(eventArchive));

    // Visual feedback
    const btn = document.getElementById('saveEventSlotBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
    console.log(`事件存档已保存到 ${slotKey}:`, eventArchive.length, '个标记');
}

// Load events from a slot
function loadEventSlot() {
    const slotSelect = document.getElementById('eventSlotSelect');
    if (!slotSelect) return;

    const slotKey = slotSelect.value;
    const data = localStorage.getItem(slotKey);

    if (!data) {
        console.log('该存档槽为空');
        return;
    }

    const eventArchive = JSON.parse(data);
    let matchCount = 0;

    eventArchive.forEach(archive => {
        // Try to find matching layer by name + coords
        let matchedLayer = null;

        drawnItems.eachLayer(layer => {
            if (matchedLayer) return;

            const layerName = layer.options?.name || layer.feature?.properties?.name || '未命名';

            // Match by name first
            if (layerName === archive.name) {
                // Verify by coordinates proximity
                let layerCoords = null;
                if (layer.getLatLng) {
                    const ll = layer.getLatLng();
                    layerCoords = { lat: ll.lat, lng: ll.lng };
                } else if (layer.getBounds) {
                    const center = layer.getBounds().getCenter();
                    layerCoords = { lat: center.lat, lng: center.lng };
                }

                if (layerCoords && archive.coords) {
                    const dist = Math.sqrt(
                        Math.pow(layerCoords.lat - archive.coords.lat, 2) +
                        Math.pow(layerCoords.lng - archive.coords.lng, 2)
                    );
                    if (dist < 0.001) { // ~100m tolerance
                        matchedLayer = layer;
                    }
                }
            }
        });

        if (matchedLayer) {
            // Restore events to matched layer
            saveMarkerEvents(matchedLayer, archive.events);
            matchCount++;
        }
    });

    // Visual feedback
    const btn = document.getElementById('loadEventSlotBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = `✅ 已加载 ${mathCount}`;
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
    console.log(`从 ${slotKey} 加载事件:`, matchCount, '/', eventArchive.length, '匹配');
}

window.saveEventSlot = saveEventSlot;
window.loadEventSlot = loadEventSlot;

// ==== Complete Archive System (Simplified) ==== //

// Save complete archive (layers + events as GeoJSON)
function saveCompleteSlot() {
    const slotSelect = document.getElementById('completeSlotSelect');
    if (!slotSelect) return;

    const slotKey = slotSelect.value;

    // Export current layers as GeoJSON with events in properties
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };

    drawnItems.eachLayer(layer => {
        if (layer.toGeoJSON) {
            const feature = layer.toGeoJSON();
            // Events are already in feature.properties.events (from saveMarkerEvents)
            geojson.features.push(feature);
        }
    });

    localStorage.setItem(slotKey, JSON.stringify(geojson));

    // Visual feedback
    const btn = document.getElementById('saveCompleteBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
    console.log(`完整存档已保存到 ${slotKey}:`, geojson.features.length, '个图层');
}

// Load complete archive
function loadCompleteSlot() {
    const slotSelect = document.getElementById('completeSlotSelect');
    if (!slotSelect) return;

    const slotKey = slotSelect.value;
    const data = localStorage.getItem(slotKey);

    if (!data) {
        console.log('该存档槽为空');
        return;
    }

    // Clear current layers
    drawnItems.clearLayers();

    // Import GeoJSON (events are in properties.events)
    importGeoJSON(data);

    // Visual feedback
    const btn = document.getElementById('loadCompleteBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已读取';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
    console.log(`从 ${slotKey} 读取完整存档`);
}

window.saveCompleteSlot = saveCompleteSlot;
window.loadCompleteSlot = loadCompleteSlot;

// ==== Unlimited Named Archive System ==== //
const ARCHIVE_LIST_KEY = 'archive_list';
let currentArchiveId = null;

// Get archive list
function getArchiveList() {
    const data = localStorage.getItem(ARCHIVE_LIST_KEY);
    return data ? JSON.parse(data) : [];
}

// Save archive list
function saveArchiveList(list) {
    localStorage.setItem(ARCHIVE_LIST_KEY, JSON.stringify(list));
}

// Render archive list UI
function renderArchiveList() {
    const container = document.getElementById('archiveList');
    if (!container) return;

    const archives = getArchiveList();

    if (archives.length === 0) {
        container.innerHTML = '<p style="color:#666;font-size:0.8rem;text-align:center;">暂无存档</p>';
        return;
    }

    container.innerHTML = archives.map(arc => `
        <div class="archive-item">
            <span class="archive-item-name">📁 ${arc.name}</span>
            <span class="archive-item-date">${arc.created}</span>
            <div class="archive-item-actions">
                <button class="load-btn" onclick="loadArchive('${arc.id}')">读取</button>
                <button class="delete-btn" onclick="deleteArchive('${arc.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

// Create new archive
function createArchive() {
    const nameInput = document.getElementById('newArchiveName');
    const name = nameInput?.value.trim();

    if (!name) {
        nameInput?.focus();
        return;
    }

    const id = 'arc_' + Date.now();
    const created = new Date().toLocaleDateString('zh-CN');

    // Save archive data
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };
    drawnItems.eachLayer(layer => {
        if (layer.toGeoJSON) {
            geojson.features.push(layer.toGeoJSON());
        }
    });
    localStorage.setItem(id, JSON.stringify(geojson));

    // Update archive list
    const list = getArchiveList();
    list.unshift({ id, name, created });
    saveArchiveList(list);

    // Clear input and refresh
    nameInput.value = '';
    renderArchiveList();

    // Set as current
    currentArchiveId = id;
    updateCurrentArchiveInfo(name);

    console.log('创建存档:', name);
}

// Load archive
function loadArchive(id) {
    const data = localStorage.getItem(id);
    if (!data) {
        console.log('存档不存在');
        return;
    }

    drawnItems.clearLayers();
    importGeoJSON(data);

    // Update current archive
    const list = getArchiveList();
    const arc = list.find(a => a.id === id);
    currentArchiveId = id;
    updateCurrentArchiveInfo(arc?.name || '未知');

    console.log('加载存档:', arc?.name);
}

// Delete archive
function deleteArchive(id) {
    if (!confirm('确定删除此存档？')) return;

    localStorage.removeItem(id);

    const list = getArchiveList().filter(a => a.id !== id);
    saveArchiveList(list);

    if (currentArchiveId === id) {
        currentArchiveId = null;
        document.getElementById('currentArchiveInfo').style.display = 'none';
    }

    renderArchiveList();
}

// Save to current archive
function saveCurrentArchive() {
    if (!currentArchiveId) return;

    const geojson = {
        type: 'FeatureCollection',
        features: []
    };
    drawnItems.eachLayer(layer => {
        if (layer.toGeoJSON) {
            geojson.features.push(layer.toGeoJSON());
        }
    });
    localStorage.setItem(currentArchiveId, JSON.stringify(geojson));

    // Visual feedback
    const btn = document.querySelector('#currentArchiveInfo button');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
}

// Update current archive info display
function updateCurrentArchiveInfo(name) {
    const info = document.getElementById('currentArchiveInfo');
    const nameEl = document.getElementById('currentArchiveName');
    if (info && nameEl) {
        nameEl.textContent = name;
        info.style.display = 'flex';
    }
}

// Initialize archive list on page load
setTimeout(renderArchiveList, 100);

window.createArchive = createArchive;
window.loadArchive = loadArchive;
window.deleteArchive = deleteArchive;
window.saveCurrentArchive = saveCurrentArchive;

// ==== Attachment System ==== //
const MAX_ATTACHMENT_SIZE = 500 * 1024; // 500KB

// Upload attachment
function uploadAttachment() {
    const input = document.getElementById('attachmentInput');
    if (!input?.files?.length) return;

    const file = input.files[0];

    if (file.size > MAX_ATTACHMENT_SIZE) {
        console.log('文件太大，最大支持500KB');
        input.value = '';
        return;
    }

    if (!currentTrackedFeature || !currentEditingEventId) {
        console.log('请先选择一个事件');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const attachment = {
            id: 'att_' + Date.now(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result
        };

        const eventData = currentTrackedFeature._currentEventData;
        if (!eventData.attachments) eventData.attachments = [];
        eventData.attachments.push(attachment);

        renderAttachmentList(eventData.attachments);
        input.value = '';

        console.log('附件已上传:', file.name);
    };
    reader.readAsDataURL(file);
}

// Render attachment list
function renderAttachmentList(attachments) {
    const container = document.getElementById('attachmentList');
    if (!container) return;

    if (!attachments || attachments.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = attachments.map((att, index) => {
        const icon = getAttachmentIcon(att.type);
        const size = formatFileSize(att.size);
        return `
            <div class="attachment-item">
                <div class="attachment-item-info">
                    <span class="attachment-item-icon">${icon}</span>
                    <span class="attachment-item-name">${att.name}</span>
                    <span class="attachment-item-size">(${size})</span>
                </div>
                <div class="attachment-item-actions">
                    <button onclick="downloadAttachment(${index})">下载</button>
                    <button class="delete-btn" onclick="deleteAttachment(${index})">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// Get icon for attachment type
function getAttachmentIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    return '📎';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

// Download attachment
function downloadAttachment(index) {
    const eventData = currentTrackedFeature?._currentEventData;
    if (!eventData?.attachments?.[index]) return;

    const att = eventData.attachments[index];
    const link = document.createElement('a');
    link.href = att.data;
    link.download = att.name;
    link.click();
}

// Delete attachment
function deleteAttachment(index) {
    const eventData = currentTrackedFeature?._currentEventData;
    if (!eventData?.attachments) return;

    eventData.attachments.splice(index, 1);
    renderAttachmentList(eventData.attachments);
}

window.uploadAttachment = uploadAttachment;
window.downloadAttachment = downloadAttachment;
window.deleteAttachment = deleteAttachment;

// ==== Code Editor Archive System ==== //
const CODE_ARCHIVE_LIST_KEY = 'code_archive_list';
let currentCodeArchiveId = null;

function getCodeArchiveList() {
    const data = localStorage.getItem(CODE_ARCHIVE_LIST_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCodeArchiveList(list) {
    localStorage.setItem(CODE_ARCHIVE_LIST_KEY, JSON.stringify(list));
}

function renderCodeArchiveList() {
    const container = document.getElementById('codeArchiveList');
    if (!container) return;

    const archives = getCodeArchiveList();

    if (archives.length === 0) {
        container.innerHTML = '<p style="color:#666;font-size:0.8rem;text-align:center;">暂无代码存档</p>';
        return;
    }

    container.innerHTML = archives.map(arc => `
        <div class="archive-item">
            <span class="archive-item-name">📝 ${arc.name}</span>
            <span class="archive-item-date">${arc.created}</span>
            <div class="archive-item-actions">
                <button class="load-btn" onclick="loadCodeArchive('${arc.id}')">读取</button>
                <button class="delete-btn" onclick="deleteCodeArchive('${arc.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

function createCodeArchive() {
    const nameInput = document.getElementById('newCodeArchiveName');
    const name = nameInput?.value.trim();

    if (!name) {
        nameInput?.focus();
        return;
    }

    const id = 'code_arc_' + Date.now();
    const created = new Date().toLocaleDateString('zh-CN');

    // Save current editor content
    const content = geojsonEditor?.value || '';
    localStorage.setItem(id, content);

    const list = getCodeArchiveList();
    list.unshift({ id, name, created });
    saveCodeArchiveList(list);

    nameInput.value = '';
    renderCodeArchiveList();

    currentCodeArchiveId = id;
    updateCurrentCodeArchiveInfo(name);

    console.log('创建代码存档:', name);
}

function loadCodeArchive(id) {
    const data = localStorage.getItem(id);
    if (data === null) {
        console.log('代码存档不存在');
        return;
    }

    if (geojsonEditor) {
        geojsonEditor.value = data;
    }

    const list = getCodeArchiveList();
    const arc = list.find(a => a.id === id);
    currentCodeArchiveId = id;
    updateCurrentCodeArchiveInfo(arc?.name || '未知');

    console.log('加载代码存档:', arc?.name);
}

function deleteCodeArchive(id) {
    if (!confirm('确定删除此代码存档？')) return;

    localStorage.removeItem(id);

    const list = getCodeArchiveList().filter(a => a.id !== id);
    saveCodeArchiveList(list);

    if (currentCodeArchiveId === id) {
        currentCodeArchiveId = null;
        const info = document.getElementById('currentCodeArchiveInfo');
        if (info) info.style.display = 'none';
    }

    renderCodeArchiveList();
}

function saveCurrentCodeArchive() {
    if (!currentCodeArchiveId) return;

    const content = geojsonEditor?.value || '';
    localStorage.setItem(currentCodeArchiveId, content);

    const btn = document.querySelector('#currentCodeArchiveInfo button');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
}

function updateCurrentCodeArchiveInfo(name) {
    const info = document.getElementById('currentCodeArchiveInfo');
    const nameEl = document.getElementById('currentCodeArchiveName');
    if (info && nameEl) {
        nameEl.textContent = name;
        info.style.display = 'flex';
    }
}

setTimeout(renderCodeArchiveList, 100);

window.createCodeArchive = createCodeArchive;
window.loadCodeArchive = loadCodeArchive;
window.deleteCodeArchive = deleteCodeArchive;
window.saveCurrentCodeArchive = saveCurrentCodeArchive;


// Close event tracker
if (closeEventTrackerBtn) {
    closeEventTrackerBtn.addEventListener('click', () => {
        // Auto-save before closing
        if (currentTrackedFeature && currentTrackedFeature._eventId) {
            const eventData = currentTrackedFeature._currentEventData || initEventData();
            eventData.notes = eventNotes.value;
            setEventData(currentTrackedFeature._eventId, eventData);
            console.log('Event data auto-saved on close');
        }
        eventTrackerPanel.style.display = 'none';
        currentTrackedFeature = null;
    });
} else {
    console.error('closeEventTrackerBtn not found!');
}

// Todo List Functions
function renderTodoList(todos) {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoItem(index));

        const text = document.createElement('span');
        text.className = `todo-item-text${todo.completed ? ' completed' : ''}`;
        text.textContent = todo.text;

        const time = document.createElement('span');
        time.className = 'todo-item-time';
        const date = new Date(todo.created);
        time.textContent = `${date.getMonth() + 1}/${date.getDate()}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-item-delete';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => deleteTodoItem(index));

        todoItem.appendChild(checkbox);
        todoItem.appendChild(text);
        todoItem.appendChild(time);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);
    });
}

function addTodoItem() {
    if (!currentTrackedFeature) return;
    const text = newTodoInput.value.trim();
    if (!text) return;

    const eventData = currentTrackedFeature._currentEventData;
    if (!eventData.todos) eventData.todos = [];

    eventData.todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        created: Date.now()
    });

    // Save to localStorage immediately
    setEventData(currentTrackedFeature._eventId, eventData);
    renderTodoList(eventData.todos);
    newTodoInput.value = '';
}

function toggleTodoItem(index) {
    if (!currentTrackedFeature) return;
    const eventData = currentTrackedFeature._currentEventData;
    eventData.todos[index].completed = !eventData.todos[index].completed;
    setEventData(currentTrackedFeature._eventId, eventData);
    renderTodoList(eventData.todos);
}

function deleteTodoItem(index) {
    if (!currentTrackedFeature) return;
    const eventData = currentTrackedFeature._currentEventData;
    eventData.todos.splice(index, 1);
    setEventData(currentTrackedFeature._eventId, eventData);
    renderTodoList(eventData.todos);
}



if (addTodoBtn) {
    addTodoBtn.addEventListener('click', addTodoItem);
} else {
    console.error('addTodoBtn not found!');
}

if (newTodoInput) {
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodoItem();
    });
}


// URL Functions
function renderUrlList(urls) {
    urlList.innerHTML = '';
    urls.forEach((urlItem, index) => {
        const item = document.createElement('div');
        item.className = 'url-item';

        const link = document.createElement('a');
        link.href = urlItem.url;
        link.target = '_blank';
        link.textContent = urlItem.title || urlItem.url;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'url-item-delete';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click'

            , () => deleteUrlItem(index));

        item.appendChild(link);
        item.appendChild(deleteBtn);
        urlList.appendChild(item);
    });
}

function addUrlItem() {
    if (!currentTrackedFeature) return;
    const title = urlTitle.value.trim();
    const url = urlAddress.value.trim();

    if (!url) {
        return;
    }


    const eventData = currentTrackedFeature._currentEventData;
    if (!eventData.urls) eventData.urls = [];

    eventData.urls.push({
        title: title || url,
        url: url,
        added: Date.now()
    });

    setEventData(currentTrackedFeature._eventId, eventData);
    renderUrlList(eventData.urls);
    urlTitle.value = '';
    urlAddress.value = '';
}

function deleteUrlItem(index) {
    if (!currentTrackedFeature) return;
    const eventData = currentTrackedFeature._currentEventData;
    eventData.urls.splice(index, 1);
    setEventData(currentTrackedFeature._eventId, eventData);
    renderUrlList(eventData.urls);
}



if (addUrlBtn) {
    addUrlBtn.addEventListener('click', addUrlItem);
} else {
    console.error('addUrlBtn not found!');
}


// Timeline Functions
function renderTimeline(events) {
    timelineDisplay.innerHTML = '';

    // Sort events by date (newest first)
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEvents.forEach((event, index) => {
        const eventEl = document.createElement('div');
        eventEl.className = 'timeline-event';

        const date = document.createElement('div');
        date.className = 'timeline-event-date';
        const d = new Date(event.date);
        const dateStr = d.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        date.textContent = dateStr.replace(/\//g, '-');

        const title = document.createElement('div');
        title.className = 'timeline-event-title';
        title.textContent = event.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'timeline-event-delete';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => deleteTimelineEvent(events.findIndex(e => e.id === event.id)));

        eventEl.appendChild(date);
        eventEl.appendChild(title);
        if (event.description) {
            const desc = document.createElement('div');
            desc.className = 'timeline-event-description';
            desc.textContent = event.description;
            eventEl.appendChild(desc);
        }
        eventEl.appendChild(deleteBtn);

        timelineDisplay.appendChild(eventEl);
    });
}

function addTimelineEvent() {
    if (!currentTrackedFeature) return;
    const date = timelineDate.value;
    const title = timelineTitle.value.trim();

    if (!date || !title) {
        return;
    }


    const eventData = currentTrackedFeature._currentEventData;
    if (!eventData.timeline) eventData.timeline = [];

    eventData.timeline.push({
        id: Date.now(),
        date: date,
        title: title,
        description: '',
        type: 'event'
    });

    setEventData(currentTrackedFeature._eventId, eventData);
    renderTimeline(eventData.timeline);
    timelineDate.value = '';
    timelineTitle.value = '';
}

function deleteTimelineEvent(index) {
    if (!currentTrackedFeature) return;
    const eventData = currentTrackedFeature._currentEventData;
    eventData.timeline.splice(index, 1);
    setEventData(currentTrackedFeature._eventId, eventData);
    renderTimeline(eventData.timeline);
}


if (addTimelineBtn) {
    addTimelineBtn.addEventListener('click', addTimelineEvent);
} else {
    console.error('addTimelineBtn not found!');
}


// Save event data button
if (saveEventDataBtn) {
    saveEventDataBtn.addEventListener('click', () => {
        if (!currentTrackedFeature) {
            alert('没有选中的图层');
            return;
        }

        const eventData = currentTrackedFeature._currentEventData;
        eventData.notes = eventNotes.value;
        setEventData(currentTrackedFeature._eventId, eventData);

        alert('✅ 事件数据已保存到本地存储！\n\n数据与图层分开存储，刷新页面后重新打开事件追踪器即可查看。');
    });
} else {
    console.error('saveEventDataBtn not found!');
}


// Add click handler to features to open event tracker
map.on('click', (e) => {
    // Check if click is on a layer
    let clickedLayer = null;
    drawnItems.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const latlng = layer.getLatLng();
            const distance = map.distance(e.latlng, latlng);
            if (distance < 50) { // 50 meters threshold
                clickedLayer = layer;
            }
        } else if (layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Circle) {
            // Check if click is inside polygon/circle
            try {
                if (layer.getBounds && layer.getBounds().contains(e.latlng)) {
                    clickedLayer = layer;
                }
            } catch (err) {
                // Ignore bounds errors
            }
        }
    });

    // If shift key is pressed and a layer is clicked, open event tracker
    if (e.originalEvent.shiftKey && clickedLayer) {
        e.originalEvent.preventDefault();
        openEventTracker(clickedLayer);
    }
});

// ==== Debug: Verify Event Tracker Elements ==== //
console.log('=== Event Tracker Elements Debug ===');
console.log('eventTrackerPanel:', eventTrackerPanel ? 'FOUND' : 'NOT FOUND');
console.log('closeEventTrackerBtn:', closeEventTrackerBtn ? 'FOUND' : 'NOT FOUND');
console.log('saveEventDataBtn:', saveEventDataBtn ? 'FOUND' : 'NOT FOUND');
console.log('addTodoBtn:', addTodoBtn ? 'FOUND' : 'NOT FOUND');
console.log('addUrlBtn:', addUrlBtn ? 'FOUND' : 'NOT FOUND');
console.log('addTimelineBtn:', addTimelineBtn ? 'FOUND' : 'NOT FOUND');
console.log('===================================');

// ==== CRITICAL: Define Global Functions at End of Script ==== //
function closeEventTracker() {
    console.log('closeEventTracker() called!');
    try {
        // Auto-save current event if editing
        if (currentTrackedFeature && currentEditingEventId) {
            const events = getMarkerEvents(currentTrackedFeature);
            const eventIndex = events.findIndex(e => e.id === currentEditingEventId);
            if (eventIndex !== -1 && currentTrackedFeature._currentEventData) {
                events[eventIndex].name = document.getElementById('currentEventName')?.value || '未命名事件';
                events[eventIndex].notes = eventNotes?.value || '';
                events[eventIndex].todos = currentTrackedFeature._currentEventData.todos || [];
                events[eventIndex].urls = currentTrackedFeature._currentEventData.urls || [];
                events[eventIndex].timeline = currentTrackedFeature._currentEventData.timeline || [];
                saveMarkerEvents(currentTrackedFeature, events);
            }
        }
        document.getElementById('eventTrackerPanel').style.display = 'none';
        currentTrackedFeature = null;
        currentEditingEventId = null;
    } catch (e) {
        console.error('Error closing:', e);
    }
}

// Make sure functions are globally accessible
window.closeEventTracker = closeEventTracker;

console.log('Global functions defined:', typeof closeEventTracker, typeof saveCurrentEvent);
